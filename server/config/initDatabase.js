/**
 * Database Initialization Script
 * Run this after setting up your database to create initial admin user and sample data
 */

require('dotenv').config();
const { User, Artist, Product, syncDatabase } = require('../models');

const initDatabase = async () => {
  try {
    console.log('🔄 Initializing database...\n');

    // Sync database (create tables)
    await syncDatabase(true); // true = drop existing tables and recreate

    // Create admin user
    console.log('👤 Creating admin user...');
    const admin = await User.create({
      email: process.env.ADMIN_EMAIL || 'admin@baerenfell.store',
      password: process.env.ADMIN_PASSWORD || 'changeme123',
      firstName: 'Admin',
      lastName: 'Bärenfell',
      role: 'admin'
    });
    console.log(`✅ Admin created: ${admin.email}`);

    // Create sample artists
    console.log('\n🎨 Creating sample artists...');

    const maxMuller = await Artist.create({
      name: 'Max Müller',
      bio: 'Vintage Illustrationen, traditionelle Techniken. Arbeitet aus einem Atelier in der Lorraine.',
      location: 'Bern, Lorraine',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
      order: 1
    });

    const annaSchmidt = await Artist.create({
      name: 'Anna Schmidt',
      bio: 'Digitale Kunst, Streetart. Inspiriert von Berner Graffiti-Kultur und urbanen Räumen.',
      location: 'Bern',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop',
      instagram: '@anna_art_bern',
      order: 2
    });

    const lisaWeber = await Artist.create({
      name: 'Lisa Weber',
      bio: 'Minimalistische Designs. Liebt klare Linien und zeitlose Muster aus der Natur.',
      location: 'Bern',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop',
      order: 3
    });

    const tomKlein = await Artist.create({
      name: 'Tom Klein',
      bio: 'Urban Artist. Fotografiert Stadtlandschaften und übersetzt sie in tragbare Kunst.',
      location: 'Bern',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop',
      order: 4
    });

    console.log('✅ Sample artists created');

    // Create sample products
    console.log('\n👕 Creating sample products...');

    await Product.create({
      name: 'Vintage Bear Tee',
      description: 'Klassisches T-Shirt mit vintage Bären-Illustration',
      story: 'Gedruckt in unserem Atelier nahe der Reitschule',
      price: 45.00,
      category: 'tshirt',
      sizes: ['S', 'M', 'L', 'XL'],
      stock: 20,
      artistId: maxMuller.id,
      mainImage: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=700&fit=crop',
      hoverImage: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&h=700&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=700&fit=crop',
        'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&h=700&fit=crop'
      ],
      isActive: true,
      isFeatured: true,
      order: 1
    });

    await Product.create({
      name: 'Forest Hoodie',
      description: 'Gemütlicher Hoodie mit Waldmotiv',
      story: 'Inspiriert von der Aare im Herbst',
      price: 85.00,
      category: 'hoodie',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      stock: 15,
      artistId: annaSchmidt.id,
      mainImage: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=800&fit=crop',
      hoverImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=800&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=800&fit=crop',
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=800&fit=crop'
      ],
      isActive: true,
      isFeatured: true,
      order: 2
    });

    await Product.create({
      name: 'Canvas Tote',
      description: 'Robuste Canvas-Tasche für den Alltag',
      story: 'Perfekt für den Markt am Bundesplatz',
      price: 25.00,
      category: 'bag',
      sizes: ['One Size'],
      stock: 30,
      artistId: lisaWeber.id,
      mainImage: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=650&fit=crop',
      hoverImage: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&h=650&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=650&fit=crop',
        'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&h=650&fit=crop'
      ],
      isActive: true,
      order: 3
    });

    await Product.create({
      name: 'Mountain Tee',
      description: 'T-Shirt mit Bergmotiv aus dem Berner Oberland',
      story: 'Berner Oberland meets Stadtkultur',
      price: 45.00,
      category: 'tshirt',
      sizes: ['S', 'M', 'L', 'XL'],
      stock: 18,
      artistId: maxMuller.id,
      mainImage: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=750&fit=crop',
      hoverImage: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&h=750&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=750&fit=crop',
        'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&h=750&fit=crop'
      ],
      isActive: true,
      order: 4
    });

    await Product.create({
      name: 'Urban Hoodie',
      description: 'Streetwear Hoodie mit urbanem Design',
      story: 'Getragen auf den Straßen von Bern',
      price: 85.00,
      category: 'hoodie',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      stock: 12,
      artistId: tomKlein.id,
      mainImage: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=720&fit=crop',
      hoverImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=720&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=720&fit=crop',
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=720&fit=crop'
      ],
      isActive: true,
      order: 5
    });

    await Product.create({
      name: 'Vintage Bag',
      description: 'Vintage-Style Stofftasche',
      story: 'Handbedruckt im Kollektiv-Studio',
      price: 30.00,
      category: 'bag',
      sizes: ['One Size'],
      stock: 25,
      artistId: lisaWeber.id,
      mainImage: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600&h=680&fit=crop',
      hoverImage: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&h=680&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600&h=680&fit=crop',
        'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&h=680&fit=crop'
      ],
      isActive: true,
      order: 6
    });

    console.log('✅ Sample products created');

    console.log('\n✨ Database initialization complete!');
    console.log('\n📝 Admin credentials:');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'changeme123'}`);
    console.log('\n⚠️  IMPORTANT: Change the admin password after first login!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
};

initDatabase();
