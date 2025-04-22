import os
import datetime
from app import db, User, Category, Tag, Wallpaper, WallpaperTag
from werkzeug.security import generate_password_hash

# Clear existing data
db.drop_all()
db.create_all()

# Create categories
categories = [
    {
        'name': 'Abstract',
        'slug': 'abstract',
        'image_url': '/static/images/categories/abstract.jpg'
    },
    {
        'name': 'Nature',
        'slug': 'nature',
        'image_url': '/static/images/categories/nature.jpg'
    },
    {
        'name': 'Space',
        'slug': 'space',
        'image_url': '/static/images/categories/space.jpg'
    },
    {
        'name': 'Futuristic',
        'slug': 'futuristic',
        'image_url': '/static/images/categories/futuristic.jpg'
    },
    {
        'name': 'Sci-Fi',
        'slug': 'sci-fi',
        'image_url': '/static/images/categories/sci-fi.jpg'
    },
    {
        'name': 'Minimalist',
        'slug': 'minimalist',
        'image_url': '/static/images/categories/minimalist.jpg'
    }
]

category_objects = {}
for category in categories:
    c = Category(**category)
    db.session.add(c)
    category_objects[category['slug']] = c

db.session.commit()

# Create tags
tags = [
    {'name': '4K'},
    {'name': 'HD'},
    {'name': 'Abstract'},
    {'name': 'Nature'},
    {'name': 'Space'},
    {'name': 'Futuristic'},
    {'name': 'Sci-Fi'},
    {'name': 'Minimalist'},
    {'name': 'Dark'},
    {'name': 'Light'},
    {'name': 'Colorful'},
    {'name': 'Desktop'},
    {'name': 'Mobile'},
    {'name': 'Galaxy'},
    {'name': 'Neon'},
    {'name': 'Cyberpunk'},
    {'name': 'Geometric'},
    {'name': 'AI-Generated'}
]

tag_objects = {}
for tag in tags:
    t = Tag(**tag)
    db.session.add(t)
    tag_objects[tag['name']] = t

db.session.commit()

# Create wallpapers
wallpapers = [
    {
        'title': 'Neon City Lights',
        'slug': 'neon-city-lights',
        'description': 'A stunning neon cityscape with vibrant colors and futuristic elements.',
        'image_url': '/static/images/wallpapers/neon-city-lights.jpg',
        'width': 3840,
        'height': 2160,
        'file_size': '2.3 MB',
        'format': 'JPG',
        'category_id': category_objects['futuristic'].id,
        'is_premium': False,
        'is_featured': False,
        'is_popular': True,
        'is_new': True,
        'downloads': 1245,
        'views': 5678,
        'tags': ['4K', 'Futuristic', 'Neon', 'Cyberpunk', 'AI-Generated']
    },
    {
        'title': 'Abstract Fluid',
        'slug': 'abstract-fluid',
        'description': 'Colorful abstract fluid shapes create a mesmerizing and unique pattern.',
        'image_url': '/static/images/wallpapers/abstract-fluid.jpg',
        'width': 3840,
        'height': 2160,
        'file_size': '1.8 MB',
        'format': 'JPG',
        'category_id': category_objects['abstract'].id,
        'is_premium': False,
        'is_featured': True,
        'is_popular': True,
        'is_new': True,
        'downloads': 987,
        'views': 3421,
        'tags': ['4K', 'Abstract', 'Colorful', 'AI-Generated']
    },
    {
        'title': 'Cosmic Galaxy',
        'slug': 'cosmic-galaxy',
        'description': 'A breathtaking view of a distant galaxy with stars and nebula clouds.',
        'image_url': '/static/images/wallpapers/cosmic-galaxy.jpg',
        'width': 3840,
        'height': 2160,
        'file_size': '2.5 MB',
        'format': 'JPG',
        'category_id': category_objects['space'].id,
        'is_premium': False,
        'is_featured': True,
        'is_popular': False,
        'is_new': True,
        'downloads': 756,
        'views': 2890,
        'tags': ['4K', 'Space', 'Galaxy', 'Dark', 'AI-Generated']
    },
    {
        'title': 'Serene Forest',
        'slug': 'serene-forest',
        'description': 'A peaceful forest scene with morning mist and sunlight filtering through the trees.',
        'image_url': '/static/images/wallpapers/serene-forest.jpg',
        'width': 3840,
        'height': 2160,
        'file_size': '2.1 MB',
        'format': 'JPG',
        'category_id': category_objects['nature'].id,
        'is_premium': False,
        'is_featured': False,
        'is_popular': False,
        'is_new': True,
        'downloads': 542,
        'views': 1876,
        'tags': ['4K', 'Nature', 'Desktop', 'AI-Generated']
    },
    {
        'title': 'Futuristic Code',
        'slug': 'futuristic-code',
        'description': 'An abstract visualization of computer code in a futuristic digital space.',
        'image_url': '/static/images/wallpapers/futuristic-code.jpg',
        'width': 3840,
        'height': 2160,
        'file_size': '1.9 MB',
        'format': 'JPG',
        'category_id': category_objects['futuristic'].id,
        'is_premium': False,
        'is_featured': True,
        'is_popular': True,
        'is_new': True,
        'downloads': 1023,
        'views': 4567,
        'tags': ['4K', 'Futuristic', 'Cyberpunk', 'Dark', 'AI-Generated']
    },
    {
        'title': 'Minimalist Shapes',
        'slug': 'minimalist-shapes',
        'description': 'Simple geometric shapes on a clean background for a minimalist aesthetic.',
        'image_url': '/static/images/wallpapers/minimalist-shapes.jpg',
        'width': 3840,
        'height': 2160,
        'file_size': '1.2 MB',
        'format': 'JPG',
        'category_id': category_objects['minimalist'].id,
        'is_premium': False,
        'is_featured': True,
        'is_popular': False,
        'is_new': True,
        'downloads': 687,
        'views': 2145,
        'tags': ['4K', 'Minimalist', 'Geometric', 'Light', 'AI-Generated']
    },
    {
        'title': 'Deep Space Nebula',
        'slug': 'deep-space-nebula',
        'description': 'A colorful nebula in deep space with swirling gases and twinkling stars.',
        'image_url': '/static/images/wallpapers/deep-space-nebula.jpg',
        'width': 3840,
        'height': 2160,
        'file_size': '2.4 MB',
        'format': 'JPG',
        'category_id': category_objects['space'].id,
        'is_premium': False,
        'is_featured': False,
        'is_popular': True,
        'is_new': True,
        'downloads': 876,
        'views': 3210,
        'tags': ['4K', 'Space', 'Colorful', 'Galaxy', 'AI-Generated']
    },
    {
        'title': 'Neon Geometry',
        'slug': 'neon-geometry',
        'description': 'Bright neon geometric shapes floating in a dark space creating a 3D effect.',
        'image_url': '/static/images/wallpapers/neon-geometry.jpg',
        'width': 1080,
        'height': 1920,
        'file_size': '1.5 MB',
        'format': 'JPG',
        'category_id': category_objects['abstract'].id,
        'is_premium': False,
        'is_featured': False,
        'is_popular': True,
        'is_new': True,
        'downloads': 912,
        'views': 3456,
        'tags': ['HD', 'Abstract', 'Neon', 'Geometric', 'Mobile', 'AI-Generated']
    },
    {
        'title': 'Mountain Sunset',
        'slug': 'mountain-sunset',
        'description': 'A breathtaking sunset view over mountain ranges with vibrant colors.',
        'image_url': '/static/images/wallpapers/mountain-sunset.jpg',
        'width': 3840,
        'height': 2160,
        'file_size': '2.2 MB',
        'format': 'JPG',
        'category_id': category_objects['nature'].id,
        'is_premium': False,
        'is_featured': False,
        'is_popular': False,
        'is_new': True,
        'downloads': 634,
        'views': 2134,
        'tags': ['4K', 'Nature', 'Desktop', 'AI-Generated']
    },
    {
        'title': 'Sci-Fi Portal',
        'slug': 'sci-fi-portal',
        'description': 'A mysterious portal to another dimension with futuristic sci-fi elements.',
        'image_url': '/static/images/wallpapers/sci-fi-portal.jpg',
        'width': 3840,
        'height': 2160,
        'file_size': '2.3 MB',
        'format': 'JPG',
        'category_id': category_objects['sci-fi'].id,
        'is_premium': True,
        'is_featured': False,
        'is_popular': True,
        'is_new': True,
        'downloads': 765,
        'views': 2987,
        'tags': ['4K', 'Sci-Fi', 'Futuristic', 'Dark', 'AI-Generated']
    }
]

# Create wallpaper records and tag relationships
for wallpaper_data in wallpapers:
    tags_list = wallpaper_data.pop('tags')
    
    wallpaper = Wallpaper(**wallpaper_data)
    db.session.add(wallpaper)
    db.session.flush()
    
    for tag_name in tags_list:
        wallpaper_tag = WallpaperTag(
            wallpaper_id=wallpaper.id,
            tag_id=tag_objects[tag_name].id
        )
        db.session.add(wallpaper_tag)

# Update category counts
for category in Category.query.all():
    count = Wallpaper.query.filter_by(category_id=category.id).count()
    category.count = count

# Create a test user
admin_user = User(
    username='admin',
    email='admin@example.com',
    password=generate_password_hash('password123')
)
db.session.add(admin_user)

# Commit all changes
db.session.commit()

print("Database seeded successfully.")