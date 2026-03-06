require('dotenv').config();
const mongoose = require('mongoose');
const Bus = require('./models/Bus');
const Location = require('./models/Location');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/smart_campus';

const campusLocations = [
    {
        locationId: 'block-a',
        name: 'Block A',
        description: 'Block A provides higher education courses such as: Bachelor of Technology (B.Tech), Master of Business Administration (MBA), Master of Computer Applications (MCA). It houses departments like Computer Science and Engineering (CSE), Electronics and Communication Engineering (ECE), Electrical and Electronics Engineering (EEE), Mechanical Engineering, Civil Engineering, and Master of Business Administration.',
        departments: ['Computer Science and Engineering (CSE)', 'Electronics and Communication Engineering (ECE)', 'Electrical and Electronics Engineering (EEE)', 'Mechanical Engineering', 'Civil Engineering', 'Master of Business Administration (MBA)'],
        timings: '8:00 AM to 4:00 PM',
        type: 'academic'
    },
    {
        locationId: 'block-b',
        name: 'Block B',
        description: 'Block B offers Diploma courses in the following branches: Civil Engineering, Mechanical Engineering, Electrical Engineering, Electronics and Telecommunication Engineering, and Computer Science. It houses departments for Civil, Mechanical, Electrical, Electronics and Telecommunication, and Computer Science.',
        departments: ['Civil Engineering', 'Mechanical Engineering', 'Electrical Engineering', 'Electronics and Telecommunication Engineering', 'Computer Science'],
        timings: '8:00 AM to 4:00 PM',
        type: 'academic'
    },
    {
        locationId: 'block-c',
        name: 'Block C',
        description: 'Block C provides the following courses: Bachelor of Computer Applications (BCA), B.Sc Nursing, JNM, and +3 Programs. It houses departments for BCA, Nursing, and +3 programs.',
        departments: ['Bachelor of Computer Applications (BCA)', 'B.Sc Nursing', 'JNM', '+3 Programs'],
        timings: '8:00 AM to 4:00 PM',
        type: 'academic'
    },
    {
        locationId: 'boys-hostel',
        name: "Boys' Hostel",
        description: "The boys' hostel is a residential facility within the campus that provides accommodation for male students coming from different cities or states. It offers basic amenities such as furnished rooms, beds, study tables, electricity, water supply, and internet facilities. There is a common mess that provides daily meals, along with recreational areas for indoor games and group activities. The hostel ensures a safe and disciplined environment with rules and supervision by wardens.",
        timings: '6:00 AM to 10:00 PM',
        type: 'residential'
    },
    {
        locationId: 'girls-hostel',
        name: "Girls' Hostel",
        description: "The girls' hostel is a residential facility within the campus that provides safe and comfortable accommodation for female students from different places. It is designed to offer a secure environment with proper supervision by wardens and strict safety rules. The hostel provides basic facilities such as furnished rooms, beds, study tables, clean washrooms, electricity, water supply, and a common mess that serves nutritious meals. Recreational spaces for indoor activities and group interaction are also available. Security measures like CCTV surveillance and restricted entry timings are maintained to ensure students' safety.",
        timings: '6:00 AM to 10:00 PM',
        type: 'residential'
    },
    {
        locationId: 'ground',
        name: 'College Ground',
        description: 'The college ground is an open area within the campus used for sports, physical activities, and various events. It provides space for games like cricket, football, volleyball, and athletics. Students use the ground for regular practice, tournaments, physical education classes, and annual sports meets.',
        timings: '8:00 AM to 4:00 PM',
        type: 'sports'
    },
    {
        locationId: 'canteen',
        name: 'Canteen',
        description: 'Campus cafeteria serving fresh meals and snacks throughout the day.',
        timings: '7:00 AM - 9:00 PM',
        type: 'facility'
    },
    {
        locationId: 'main-gate',
        name: 'Main Gate',
        description: 'Primary entrance to the campus with security checkpoint.',
        timings: '24/7 Access',
        type: 'entrance'
    },
    {
        locationId: 'gate-2',
        name: 'Gate 2',
        description: 'Secondary entrance to the campus with security checkpoint and vehicle access.',
        timings: '24/7 Access',
        type: 'entrance'
    },
    {
        locationId: 'gate-3',
        name: 'Gate 3',
        description: 'Tertiary entrance for auxiliary access with security verification.',
        timings: '24/7 Access',
        type: 'entrance'
    },
    {
        locationId: 'bus-parking',
        name: 'Bus Parking',
        description: 'Designated parking area for campus buses and transportation vehicles.',
        timings: '6:00 AM - 8:00 PM',
        type: 'facility'
    },
    {
        locationId: 'student-parking',
        name: 'Student Parking',
        description: 'Designated parking area for students with short-term and long-term bays.',
        timings: '6:00 AM - 10:00 PM',
        type: 'facility'
    },
    {
        locationId: 'security-room',
        name: 'Security Room',
        description: 'Campus security headquarters and monitoring center for campus safety and emergency response.',
        timings: '24/7 Access',
        type: 'facility'
    },
    {
        locationId: 'center',
        name: 'Center',
        description: 'Central point of the campus - common meeting area.',
        type: 'landmark'
    },
    {
        locationId: 'kalam',
        name: 'Kalam Higher Secondary School',
        description: 'Kalam Higher Secondary School provides higher secondary education in the Science stream. It houses departments for Mathematics, Physics, Chemistry, Biology, and Information Technology (IT).',
        departments: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Information Technology (IT)'],
        timings: '8:00 AM to 4:00 PM',
        type: 'academic'
    }
];

const sampleBuses = [
    {
        busName: 'Campus Bus 1',
        busNumber: 'OD-01-AB-1001',
        startLocation: 'College Campus',
        destination: 'City Center',
        stops: ['Main Gate', 'Bus Stand', 'Market Square', 'City Center'],
        departureTime: '9:00 AM',
        arrivalTime: '9:45 AM',
        routePath: [
            { lat: 20.2961, lng: 85.8245 },
            { lat: 20.2981, lng: 85.8265 },
            { lat: 20.3001, lng: 85.8285 }
        ]
    },
    {
        busName: 'Campus Bus 2',
        busNumber: 'OD-01-AB-1002',
        startLocation: 'College Campus',
        destination: 'Railway Station',
        stops: ['Main Gate', 'Gate 2', 'Overbridge', 'Railway Station'],
        departureTime: '10:30 AM',
        arrivalTime: '11:15 AM',
        routePath: [
            { lat: 20.2961, lng: 85.8245 },
            { lat: 20.2991, lng: 85.8275 },
            { lat: 20.3021, lng: 85.8305 }
        ]
    },
    {
        busName: 'Campus Bus 3',
        busNumber: 'OD-01-AB-1003',
        startLocation: 'City Center',
        destination: 'College Campus',
        stops: ['City Center', 'Market Square', 'Bus Stand', 'Main Gate'],
        departureTime: '7:30 AM',
        arrivalTime: '8:15 AM',
        routePath: [
            { lat: 20.3001, lng: 85.8285 },
            { lat: 20.2981, lng: 85.8265 },
            { lat: 20.2961, lng: 85.8245 }
        ]
    },
    {
        busName: 'Campus Bus 4',
        busNumber: 'OD-01-AB-1004',
        startLocation: 'College Campus',
        destination: 'Airport',
        stops: ['Main Gate', 'NH-16', 'Airport Road', 'Airport Terminal'],
        departureTime: '2:00 PM',
        arrivalTime: '3:00 PM',
        routePath: [
            { lat: 20.2961, lng: 85.8245 },
            { lat: 20.3100, lng: 85.8400 },
            { lat: 20.3220, lng: 85.8540 }
        ]
    },
    {
        busName: 'Campus Bus 5',
        busNumber: 'OD-01-AB-1005',
        startLocation: 'College Campus',
        destination: 'Hospital',
        stops: ['Main Gate', 'Canteen Road', 'Main Road', 'District Hospital'],
        departureTime: '8:00 AM',
        arrivalTime: '8:30 AM',
        routePath: [
            { lat: 20.2961, lng: 85.8245 },
            { lat: 20.2971, lng: 85.8255 },
            { lat: 20.2941, lng: 85.8220 }
        ]
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ MongoDB Connected');

        // Clear existing data
        await Location.deleteMany({});
        await Bus.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Seed locations
        const insertedLocations = await Location.insertMany(campusLocations);
        console.log(`✅ Seeded ${insertedLocations.length} campus locations`);

        // Seed buses
        const insertedBuses = await Bus.insertMany(sampleBuses);
        console.log(`✅ Seeded ${insertedBuses.length} buses`);

        console.log('\n🎉 Database seeded successfully!');
        console.log('\nYou can now:');
        console.log('  GET http://localhost:5000/api/locations  → all campus locations');
        console.log('  GET http://localhost:5000/api/buses      → all buses');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error.message);
        process.exit(1);
    }
};

seedDB();
