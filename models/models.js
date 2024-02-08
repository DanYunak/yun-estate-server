import sequelize from '../db.js'
import { DataTypes } from 'sequelize'

const { INTEGER, STRING, TEXT, ARRAY, DATE, NOW } = DataTypes

const User = sequelize.define('user', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    firstName: { type: STRING },
    lastName: { type: STRING },
    email: { type: STRING, unique: true },
    password: { type: STRING },
    photo: { type: STRING },
    city: { type: STRING },
    role: { type: STRING, defaultValue: "USER" }
})

// const UserPhoto = sequelize.define('user_photo', {
//     id: { type: INTEGER, primaryKey: true, autoIncrement: true },
//     url: { type: STRING }
// })

const Apartment = sequelize.define('apartment', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: STRING },
    price: { type: INTEGER },
    description: { type: TEXT },
    photos: {
        type: ARRAY(STRING),
        defaultValue: []
    },
    city: { type: STRING },
    category: { type: STRING },
    rooms: { type: INTEGER },
    bedrooms: { type: INTEGER },
    bathrooms: { type: INTEGER },
    area: { type: INTEGER },
    parking: { type: INTEGER }
})

// const ApartmentPhoto = sequelize.define('apartment_photo', {
//     id: { type: INTEGER, primaryKey: true, autoIncrement: true },
//     url: { type: STRING }
// })

const Favorite = sequelize.define('favorite', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true }
})

const Review = sequelize.define('review', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    rate: { type: INTEGER },
    description: { type: TEXT }
    // userFirstName: { type: STRING },
    // userLastName: { type: STRING },
    // userPhoto: { type: STRING },
    // userCity: { type: STRING }
})

const Agent = sequelize.define('agent', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    firstName: { type: STRING },
    lastName: { type: STRING }
})

const AgentPhoto = sequelize.define('agent_photo', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    url: { type: STRING }
})

const Token = sequelize.define('token', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: INTEGER, allowNull: false },
    refreshToken: { type: STRING, allowNull: false },
    createdAt: { type: DATE, defaultValue: NOW },
    expiresAt: { type: DATE }
})

// Apartment.hasMany(ApartmentPhoto, { as: 'apartmentPhotos' })
// ApartmentPhoto.belongsTo(Apartment, { foreignKey: 'apartmentId' })

Favorite.belongsTo(User, { foreignKey: 'userId' })
Favorite.belongsTo(Apartment, { foreignKey: 'apartmentId' })

Agent.hasOne(AgentPhoto, { as: 'agentPhoto' })
AgentPhoto.belongsTo(Agent, { foreignKey: 'agentId' })

User.hasMany(Review, { as: 'userReviews' })
Apartment.hasMany(Review, { as: 'apartmentReviews' })
Review.belongsTo(User, { foreignKey: 'userId' })
Review.belongsTo(Apartment, { foreignKey: 'apartmentId' })

// User.hasOne(UserPhoto, { as: 'userPhoto' })
// UserPhoto.belongsTo(User, { foreignKey: 'userId' })

export {
    User,
    // UserPhoto,
    Apartment,
    // ApartmentPhoto,
    Favorite,
    Review,
    Agent,
    AgentPhoto,
    Token
}