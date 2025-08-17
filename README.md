# 🏢 Apartment Hub

A simplified apartment rentals mobile app built with **React Native** that supports user authentication, role-based access, apartment listing, and local caching for offline access. Designed as a production-ready project demonstrating clean architecture, scalability, security, and an intuitive user experience for both realtors and regular users.

---

## 📋 Project Overview

This app enables two types of users:

- **Realtors:** Can create, read, update, and delete (CRUD) their own apartment listings.
- **Regular users:** Can browse and filter apartments by price and size.

---

## ❓ Problem & Solution

### The Problem

Apartment rental platforms need to securely manage multiple user roles with different permissions, provide up-to-date listings, and support offline access in case of network issues.

### The Solution

This app implements:

- Secure email/password authentication with user roles (realtor vs. regular user)
- Role-based UI and functionality (CRUD for realtors, browsing/filtering for regular users)
- Apartment listings with detailed information and images
- Local caching of apartment data for offline browsing
- Input validation and secure authorization to prevent unauthorized access or data manipulation

---

## ✨ Features

- User registration and sign-in with email/password
- Role selection during registration (Realtor or Regular User)
- Realtors can add, edit, and delete only their own apartments
- Regular users can browse and filter apartments by price and size
- Apartment details include preview image, description, area size, number of rooms, and price per month
- Local caching of apartment listings for offline use
- Responsive UI built with React Native components and navigation
- Input validation and graceful error handling
- Secure authentication and authorization flows

---

## 🛠️ Tech Stack & Tools

- **React Native** – Mobile app framework  
- **Firebase & Firestore** – Backend services for authentication, database, and storage  
- **AsyncStorage** – Local caching of apartment data for offline access  
- **Expo Router** – Navigation and routing  
- **React Hook Form** with **Zod** – Form handling and schema validation  
- **Context API** – State management  
- **Secure Storage** (e.g., react-native-keychain) – Secure handling of authentication tokens (optional)

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 14.x  
- React Native CLI or Expo CLI  
- Android Studio / Xcode for emulators or device testing  
- Firebase project configured for Authentication and Firestore  

### Installation

```bash
git clone https://github.com/yourusername/apartment-hub.git
cd apartment-hub
npm install
Setup Backend
Configure your Firebase project

Enable Email/Password Authentication in Firebase Authentication

Set up Firestore database for apartments and users

Update your app config files with Firebase API keys and settings

Running the App
For Android:

bash
Copy code
npx react-native run-android
For iOS:

bash
Copy code
npx react-native run-ios
Or if using Expo:

bash
Copy code
npx expo start
🧪 Development Notes
Strictly enforce role-based access: Realtors can modify only their own apartments.

Use React Hook Form and Zod for robust form validation and error handling.

Implement offline caching with AsyncStorage for seamless offline browsing.

Use Expo Router to manage navigation smoothly and maintain clean routes.

Keep code modular with Context API for scalable state management.

Handle edge cases like network loss, auth failures, and invalid data gracefully.

Follow security best practices for authentication tokens and user data privacy.

🛡️ Security Considerations
Use Firebase Authentication for secure user sign-in and role management.

Validate and sanitize all inputs to prevent injection and misuse.

Apply strict authorization checks on both client and backend to prevent unauthorized data access or modification.

Store sensitive data securely and avoid exposing tokens or credentials.

📄 License
MIT License

👤 Author
Muhammad Usman Amir
GitHub: usman-amir8

📞 Contact
For questions or clarifications, feel free to reach out!

