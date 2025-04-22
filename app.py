import os
import datetime
import json
from flask import Flask, render_template, request, jsonify, abort, redirect, url_for
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
from sqlalchemy.sql import func

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'default_secret_key')

db = SQLAlchemy(app)

# Models
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

# Helper functions for serializing models
def serialize_wallpaper(wallpaper):
    tags = [tag.tag.name for tag in wallpaper.wallpaper_tags]
    
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
        'categoryName': wallpaper.category.name if wallpaper.category else None,
        'isPremium': wallpaper.is_premium,
        'isFeatured': wallpaper.is_featured,
        'isPopular': wallpaper.is_popular,
        'isNew': wallpaper.is_new,
        'downloads': wallpaper.downloads,
        'views': wallpaper.views,
        'createdAt': wallpaper.created_at.isoformat(),
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

# Create database tables
@app.before_first_request
def create_tables():
    db.create_all()

# Template context processor
@app.context_processor
def inject_year():
    return {'year': datetime.datetime.now().year, 'adsense_client_id': os.getenv('ADSENSE_CLIENT_ID')}

# Web Routes
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
    return jsonify([serialize_category(c) for c in categories])

@app.route('/api/categories/<slug>')
def get_category(slug):
    category = Category.query.filter_by(slug=slug).first_or_404()
    return jsonify(serialize_category(category))

@app.route('/api/wallpapers')
def get_wallpapers():
    wallpapers = Wallpaper.query.order_by(Wallpaper.created_at.desc()).all()
    return jsonify([serialize_wallpaper(w) for w in wallpapers])

@app.route('/api/wallpapers/featured')
def get_featured_wallpapers():
    limit = request.args.get('limit', 4, type=int)
    wallpapers = Wallpaper.query.filter_by(is_featured=True).order_by(Wallpaper.created_at.desc()).limit(limit).all()
    return jsonify([serialize_wallpaper(w) for w in wallpapers])

@app.route('/api/wallpapers/trending')
def get_trending_wallpapers():
    limit = request.args.get('limit', 6, type=int)
    wallpapers = Wallpaper.query.filter_by(is_popular=True).order_by(Wallpaper.views.desc()).limit(limit).all()
    return jsonify([serialize_wallpaper(w) for w in wallpapers])

@app.route('/api/wallpapers/<slug>')
def get_wallpaper(slug):
    wallpaper = Wallpaper.query.filter_by(slug=slug).first_or_404()
    
    # Increment view count
    wallpaper.views += 1
    db.session.commit()
    
    return jsonify(serialize_wallpaper(wallpaper))

@app.route('/api/categories/<slug>/wallpapers')
def get_wallpapers_by_category(slug):
    category = Category.query.filter_by(slug=slug).first_or_404()
    wallpapers = Wallpaper.query.filter_by(category_id=category.id).order_by(Wallpaper.created_at.desc()).all()
    return jsonify([serialize_wallpaper(w) for w in wallpapers])

@app.route('/api/search')
def search_wallpapers():
    query = request.args.get('q', '')
    
    if not query:
        return jsonify([])
    
    # Search in title, description, and tags
    wallpapers = Wallpaper.query.filter(
        (Wallpaper.title.ilike(f'%{query}%')) |
        (Wallpaper.description.ilike(f'%{query}%'))
    ).all()
    
    # Get wallpapers with matching tags
    tag_wallpapers = Wallpaper.query.join(WallpaperTag).join(Tag).filter(
        Tag.name.ilike(f'%{query}%')
    ).all()
    
    # Combine results and remove duplicates
    result_ids = set()
    results = []
    
    for w in wallpapers + tag_wallpapers:
        if w.id not in result_ids:
            results.append(serialize_wallpaper(w))
            result_ids.add(w.id)
    
    return jsonify(results)

@app.route('/api/tags')
def get_tags():
    tags = Tag.query.all()
    return jsonify([serialize_tag(t) for t in tags])

@app.route('/api/subscribe', methods=['POST'])
def subscribe():
    data = request.json
    email = data.get('email')
    
    if not email:
        return jsonify({'message': 'Email is required'}), 400
    
    # Check if already subscribed
    existing = Subscription.query.filter_by(email=email).first()
    if existing:
        return jsonify({'message': 'You are already subscribed to our newsletter!'}), 200
    
    # Create new subscription
    subscription = Subscription(email=email)
    db.session.add(subscription)
    db.session.commit()
    
    return jsonify({'message': 'Thank you for subscribing to our newsletter!'}), 201

# Run the app
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)