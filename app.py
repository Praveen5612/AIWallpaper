from flask import Flask, render_template, jsonify, request, redirect, url_for, abort
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy import func, desc, or_
from dotenv import load_dotenv
import os
import datetime
import json
import uuid

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Define SQLAlchemy Models
class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

class Category(db.Model):
    __tablename__ = 'categories'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    slug = db.Column(db.String(50), unique=True, nullable=False)
    image_url = db.Column(db.String(255), nullable=True)
    count = db.Column(db.Integer, default=0)
    wallpapers = db.relationship('Wallpaper', backref='category', lazy=True)

class Tag(db.Model):
    __tablename__ = 'tags'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    wallpaper_tags = db.relationship('WallpaperTag', backref='tag', lazy=True)

class Wallpaper(db.Model):
    __tablename__ = 'wallpapers'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    slug = db.Column(db.String(120), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=True)
    image_url = db.Column(db.String(255), nullable=False)
    width = db.Column(db.Integer, nullable=False)
    height = db.Column(db.Integer, nullable=False)
    file_size = db.Column(db.String(20), nullable=True)
    format = db.Column(db.String(10), nullable=True)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    is_premium = db.Column(db.Boolean, default=False)
    is_featured = db.Column(db.Boolean, default=False)
    is_popular = db.Column(db.Boolean, default=False)
    is_new = db.Column(db.Boolean, default=True)
    downloads = db.Column(db.Integer, default=0)
    views = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    wallpaper_tags = db.relationship('WallpaperTag', backref='wallpaper', lazy=True)

class WallpaperTag(db.Model):
    __tablename__ = 'wallpaper_tags'
    
    id = db.Column(db.Integer, primary_key=True)
    wallpaper_id = db.Column(db.Integer, db.ForeignKey('wallpapers.id'), nullable=False)
    tag_id = db.Column(db.Integer, db.ForeignKey('tags.id'), nullable=False)

class Subscription(db.Model):
    __tablename__ = 'subscriptions'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

# Helper functions
def serialize_wallpaper(wallpaper):
    tags = []
    for wt in wallpaper.wallpaper_tags:
        tags.append(wt.tag.name)
    
    return {
        'id': wallpaper.id,
        'title': wallpaper.title,
        'slug': wallpaper.slug,
        'description': wallpaper.description,
        'imageUrl': wallpaper.image_url,
        'width': wallpaper.width,
        'height': wallpaper.height,
        'fileSize': wallpaper.file_size,
        'format': wallpaper.format,
        'categoryId': wallpaper.category_id,
        'isPremium': wallpaper.is_premium,
        'isFeatured': wallpaper.is_featured,
        'isPopular': wallpaper.is_popular,
        'isNew': wallpaper.is_new,
        'downloads': wallpaper.downloads,
        'views': wallpaper.views,
        'createdAt': wallpaper.created_at,
        'tags': tags
    }

def serialize_category(category):
    return {
        'id': category.id,
        'name': category.name,
        'slug': category.slug,
        'imageUrl': category.image_url,
        'count': category.count
    }

def serialize_tag(tag):
    return {
        'id': tag.id,
        'name': tag.name
    }

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/wallpaper/<slug>')
def wallpaper_detail(slug):
    return render_template('wallpaper.html')

@app.route('/category/<slug>')
def category(slug):
    return render_template('category.html')

@app.route('/search')
def search():
    return render_template('search.html')

# API Routes
@app.route('/api/categories')
def get_categories():
    categories = Category.query.all()
    return jsonify([serialize_category(category) for category in categories])

@app.route('/api/categories/<slug>')
def get_category(slug):
    category = Category.query.filter_by(slug=slug).first()
    if not category:
        return jsonify({"error": "Category not found"}), 404
    return jsonify(serialize_category(category))

@app.route('/api/wallpapers')
def get_wallpapers():
    wallpapers = Wallpaper.query.all()
    return jsonify([serialize_wallpaper(wallpaper) for wallpaper in wallpapers])

@app.route('/api/wallpapers/featured')
def get_featured_wallpapers():
    limit = request.args.get('limit', 4, type=int)
    wallpapers = Wallpaper.query.filter_by(is_featured=True).limit(limit).all()
    return jsonify([serialize_wallpaper(wallpaper) for wallpaper in wallpapers])

@app.route('/api/wallpapers/trending')
def get_trending_wallpapers():
    limit = request.args.get('limit', 6, type=int)
    wallpapers = Wallpaper.query.filter_by(is_popular=True).limit(limit).all()
    return jsonify([serialize_wallpaper(wallpaper) for wallpaper in wallpapers])

@app.route('/api/wallpapers/<slug>')
def get_wallpaper(slug):
    wallpaper = Wallpaper.query.filter_by(slug=slug).first()
    if not wallpaper:
        return jsonify({"error": "Wallpaper not found"}), 404
    
    # Increment views
    wallpaper.views += 1
    db.session.commit()
    
    return jsonify(serialize_wallpaper(wallpaper))

@app.route('/api/categories/<slug>/wallpapers')
def get_wallpapers_by_category(slug):
    if slug == 'all':
        wallpapers = Wallpaper.query.all()
        return jsonify([serialize_wallpaper(wallpaper) for wallpaper in wallpapers])
    
    category = Category.query.filter_by(slug=slug).first()
    if not category:
        return jsonify({"error": "Category not found"}), 404
    
    wallpapers = Wallpaper.query.filter_by(category_id=category.id).all()
    return jsonify([serialize_wallpaper(wallpaper) for wallpaper in wallpapers])

@app.route('/api/search')
def search_wallpapers():
    query = request.args.get('q', '')
    if not query:
        return jsonify([])
    
    # Search in title, description, and tags
    wallpapers = db.session.query(Wallpaper) \
        .join(WallpaperTag, Wallpaper.id == WallpaperTag.wallpaper_id) \
        .join(Tag, WallpaperTag.tag_id == Tag.id) \
        .filter(
            or_(
                Wallpaper.title.ilike(f'%{query}%'),
                Wallpaper.description.ilike(f'%{query}%'),
                Tag.name.ilike(f'%{query}%')
            )
        ).distinct().all()
    
    return jsonify([serialize_wallpaper(wallpaper) for wallpaper in wallpapers])

@app.route('/api/tags')
def get_tags():
    tags = Tag.query.all()
    return jsonify([serialize_tag(tag) for tag in tags])

@app.route('/api/subscribe', methods=['POST'])
def subscribe():
    data = request.json
    email = data.get('email')
    
    if not email:
        return jsonify({"error": "Email is required"}), 400
    
    # Check if already subscribed
    existing = Subscription.query.filter_by(email=email).first()
    if existing:
        return jsonify({"message": "You are already subscribed!"}), 200
    
    new_subscription = Subscription(email=email)
    db.session.add(new_subscription)
    db.session.commit()
    
    return jsonify({"message": "Successfully subscribed to our newsletter!"}), 201

# Initialize database
with app.app_context():
    db.create_all()
    
    # Seed database with initial data if empty
    if Category.query.count() == 0:
        # Add categories
        categories = [
            {"name": "Abstract", "slug": "abstract", "image_url": "/static/images/categories/abstract.jpg"},
            {"name": "Nature", "slug": "nature", "image_url": "/static/images/categories/nature.jpg"},
            {"name": "Space", "slug": "space", "image_url": "/static/images/categories/space.jpg"},
            {"name": "Cyberpunk", "slug": "cyberpunk", "image_url": "/static/images/categories/cyberpunk.jpg"},
            {"name": "Minimal", "slug": "minimal", "image_url": "/static/images/categories/minimal.jpg"},
            {"name": "Sci-Fi", "slug": "sci-fi", "image_url": "/static/images/categories/sci-fi.jpg"}
        ]
        
        for cat_data in categories:
            category = Category(**cat_data)
            db.session.add(category)
        
        # Add tags
        tags = ["Abstract", "Nature", "Space", "Cyberpunk", "Minimal", "Sci-Fi", 
                "Futuristic", "Dark", "Neon", "Geometric", "AI Generated"]
        
        for tag_name in tags:
            tag = Tag(name=tag_name)
            db.session.add(tag)
        
        db.session.commit()
        
        # Now add sample wallpapers
        # We need the category and tag IDs, so query them
        categories_map = {cat.slug: cat.id for cat in Category.query.all()}
        tags_map = {tag.name: tag.id for tag in Tag.query.all()}
        
        wallpapers = [
            {
                "title": "Futuristic Code",
                "slug": "futuristic-code",
                "description": "An AI-generated wallpaper featuring glowing lines of code in a futuristic cyberpunk style.",
                "image_url": "/static/images/wallpapers/futuristic-code.jpg",
                "width": 3840,
                "height": 2160,
                "file_size": "2.4 MB",
                "format": "JPG",
                "category_id": categories_map["cyberpunk"],
                "is_premium": False,
                "is_featured": True,
                "is_popular": True,
                "is_new": True,
                "downloads": 530,
                "views": 1240,
                "tags": ["Cyberpunk", "Futuristic", "Neon", "AI Generated"]
            },
            {
                "title": "Cosmic Nebula",
                "slug": "cosmic-nebula",
                "description": "A stunning cosmic nebula with stars and galaxies in vibrant purple and blue hues.",
                "image_url": "/static/images/wallpapers/cosmic-nebula.jpg",
                "width": 3840,
                "height": 2160,
                "file_size": "3.2 MB",
                "format": "JPG",
                "category_id": categories_map["space"],
                "is_premium": True,
                "is_featured": True,
                "is_popular": False,
                "is_new": True,
                "downloads": 320,
                "views": 890,
                "tags": ["Space", "Dark", "AI Generated"]
            },
            {
                "title": "Geometric Dreams",
                "slug": "geometric-dreams",
                "description": "Abstract geometric shapes in a minimalist style with soft pastel colors.",
                "image_url": "/static/images/wallpapers/geometric-dreams.jpg",
                "width": 3840,
                "height": 2160,
                "file_size": "1.8 MB",
                "format": "JPG",
                "category_id": categories_map["abstract"],
                "is_premium": False,
                "is_featured": True,
                "is_popular": True,
                "is_new": False,
                "downloads": 420,
                "views": 950,
                "tags": ["Abstract", "Geometric", "Minimal", "AI Generated"]
            },
            {
                "title": "Neon City Lights",
                "slug": "neon-city-lights",
                "description": "A futuristic cityscape with vibrant neon lights reflected in rain-soaked streets.",
                "image_url": "/static/images/wallpapers/neon-city-lights.jpg",
                "width": 3840,
                "height": 2160,
                "file_size": "2.9 MB",
                "format": "JPG",
                "category_id": categories_map["cyberpunk"],
                "is_premium": True,
                "is_featured": False,
                "is_popular": True,
                "is_new": False,
                "downloads": 680,
                "views": 1520,
                "tags": ["Cyberpunk", "Neon", "Futuristic", "AI Generated"]
            },
            {
                "title": "Serene Forest",
                "slug": "serene-forest",
                "description": "A peaceful forest scene with sunlight filtering through the trees in a mystical atmosphere.",
                "image_url": "/static/images/wallpapers/serene-forest.jpg",
                "width": 3840,
                "height": 2160,
                "file_size": "2.6 MB",
                "format": "JPG",
                "category_id": categories_map["nature"],
                "is_premium": False,
                "is_featured": True,
                "is_popular": False,
                "is_new": True,
                "downloads": 290,
                "views": 780,
                "tags": ["Nature", "AI Generated"]
            },
            {
                "title": "Minimalist Horizon",
                "slug": "minimalist-horizon",
                "description": "A clean, minimalist horizon line with a gradient sky in calming colors.",
                "image_url": "/static/images/wallpapers/minimalist-horizon.jpg",
                "width": 3840,
                "height": 2160,
                "file_size": "1.4 MB",
                "format": "JPG",
                "category_id": categories_map["minimal"],
                "is_premium": False,
                "is_featured": False,
                "is_popular": True,
                "is_new": True,
                "downloads": 350,
                "views": 820,
                "tags": ["Minimal", "AI Generated"]
            }
        ]
        
        for wp_data in wallpapers:
            # Extract tags before creating the wallpaper
            wp_tags = wp_data.pop("tags")
            
            # Create wallpaper
            wallpaper = Wallpaper(**wp_data)
            db.session.add(wallpaper)
            db.session.flush()  # Flush to get the wallpaper ID
            
            # Add wallpaper tags
            for tag_name in wp_tags:
                wallpaper_tag = WallpaperTag(
                    wallpaper_id=wallpaper.id,
                    tag_id=tags_map[tag_name]
                )
                db.session.add(wallpaper_tag)
            
            # Update category count
            category = Category.query.get(wallpaper.category_id)
            category.count += 1
        
        db.session.commit()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)