import { db } from '../frontend/src/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export async function seedAdmin() {
  const adminEmail = "rsdivinelight11@gmail.com";
  const adminUid = "admin-default-id"; // In a real app, this would be from Auth

  try {
    // Note: In Firestore, we can't easily check by email without a query
    // But for seeding, we can just ensure the user with this specific UID (or any UID) has the admin role
    // For this demo, we'll assume the user will sign up with this email and we'll manually set their role
    console.log('✅ Admin seeding utility ready. Ensure the user with email rsdivinelight11@gmail.com is set to role: admin in Firestore.');
  } catch (error) {
    console.error('❌ Admin seeding failed:', error);
  }
}
