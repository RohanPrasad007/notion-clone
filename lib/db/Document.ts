import { auth } from "../firebase";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  getDocs,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { Document } from "../type";
import { useEffect, useState } from "react";

const db = getFirestore();
const storage = getStorage();

export async function createDocument(
  title: string,
  parentDocument: string | null = null
): Promise<{ success: true; id: string } | { success: false; error: string }> {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: "User not authenticated" };
    }
    const doc: Omit<Document, "_id"> = {
      title,
      userId: user.uid,
      isArchived: false,
      isPublished: false,
      parentDocument: parentDocument ?? null,
    };
    const docRef = await addDoc(collection(db, "documents"), doc);

    return { success: true, id: docRef.id };
  } catch (error: any) {
    return { success: false, error: error.message || "Unknown error" };
  }
}

// React hook to get all documents for the current user in real-time
export function useUserDocuments(parentDocument?: string) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setDocuments([]);
      setLoading(false);
      setError("User not authenticated");
      return;
    }
    let q;
    if (parentDocument === undefined) {
      // Fetch documents with no parentDocument and isArchived is false
      q = query(
        collection(db, "documents"),
        where("userId", "==", user.uid),
        where("isArchived", "==", false),
        where("parentDocument", "==", null) // Fetch root documents
      );
    } else {
      // Fetch documents with matching parentDocument and isArchived is false
      q = query(
        collection(db, "documents"),
        where("userId", "==", user.uid),
        where("isArchived", "==", false),
        where("parentDocument", "==", parentDocument)
      );
    }
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs: Document[] = snapshot.docs.map((doc) => ({
          _id: doc.id,
          ...doc.data(),
        })) as Document[];
        setDocuments(docs);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [parentDocument]);
  return { documents, loading, error };
}

export async function archiveDocumentRecursive(id: string): Promise<boolean> {
  try {
    // Archive the main document
    await updateDoc(doc(db, "documents", id), { isArchived: true });
    // Find all children
    const childrenSnap = await getDocs(
      query(collection(db, "documents"), where("parentDocument", "==", id))
    );
    const childIds = childrenSnap.docs.map((d) => d.id);
    // Archive all children recursively
    await Promise.all(
      childIds.map((childId) => archiveDocumentRecursive(childId))
    );
    return true;
  } catch (e) {
    return false;
  }
}

export async function restoreDocumentRecursive(id: string): Promise<boolean> {
  try {
    // Get the document
    const docRef = doc(db, "documents", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return false;
    const data = docSnap.data() as Document;
    let parentShouldBeNull = false;
    // If has parentDocument, check if parent is archived
    if (data.parentDocument) {
      const parentRef = doc(db, "documents", data.parentDocument);
      const parentSnap = await getDoc(parentRef);
      if (!parentSnap.exists() || parentSnap.data().isArchived) {
        parentShouldBeNull = true;
      }
    }
    // Restore this document
    await updateDoc(docRef, {
      isArchived: false,
      parentDocument: parentShouldBeNull ? null : data.parentDocument ?? null,
    });
    // Restore all children recursively
    const childrenSnap = await getDocs(
      query(collection(db, "documents"), where("parentDocument", "==", id))
    );
    const childIds = childrenSnap.docs.map((d) => d.id);
    await Promise.all(
      childIds.map((childId) => restoreDocumentRecursive(childId))
    );
    return true;
  } catch {
    return false;
  }
}

export async function deleteDocument(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, "documents", id));
    return true;
  } catch {
    return false;
  }
}

export function useArchivedDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setDocuments([]);
      setLoading(false);
      setError("User not authenticated");
      return;
    }
    const q = query(
      collection(db, "documents"),
      where("userId", "==", user.uid),
      where("isArchived", "==", true)
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs: Document[] = snapshot.docs.map((doc) => ({
          _id: doc.id,
          ...doc.data(),
        })) as Document[];
        setDocuments(docs);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);
  return { documents, loading, error };
}

export function useSearchDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setDocuments([]);
      setLoading(false);
      setError("User not authenticated");
      return;
    }
    const q = query(
      collection(db, "documents"),
      where("userId", "==", user.uid),
      where("isArchived", "==", false)
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs: Document[] = snapshot.docs.map((doc) => ({
          _id: doc.id,
          ...doc.data(),
        })) as Document[];
        setDocuments(docs);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);
  return { documents, loading, error };
}

export function useDocumentById(id: string | null) {
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setDocument(null);
      return;
    }

    const docRef = doc(db, "documents", id);

    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (!docSnap.exists()) {
          console.warn("Document does not exist");
          setDocument(null);
          setError("Document not found");
          setLoading(false);
          return;
        }

        const data = { _id: docSnap.id, ...docSnap.data() } as Document;
        const user = auth.currentUser;

        // Case 1: Document is published and not archived - accessible to anyone
        if (data.isPublished && !data.isArchived) {
          setDocument(data);
          setError(null);
          setLoading(false);
          return;
        }

        // Case 2: User is logged in and owns the document - accessible
        if (user && user.uid === data.userId) {
          setDocument(data);
          setError(null);
          setLoading(false);
          return;
        }

        // Case 3: Not published and user doesn't own it (or no user) - not accessible
        console.warn("⛔ Unauthorized access attempt");
        setDocument(null);
        setError("Unauthorized access");
        setLoading(false);
      },
      (err) => {
        console.error("❌ Snapshot error:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [id]);

  return { document, loading, error };
}
export async function updateDocument(
  id: string,
  updates: Partial<Omit<Document, "_id" | "userId" | "parentDocument">>
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    // Get the document first to verify ownership
    const docRef = doc(db, "documents", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return { success: false, error: "Document not found" };
    }

    const documentData = docSnap.data() as Document;
    if (documentData.userId !== user.uid) {
      return { success: false, error: "Unauthorized access" };
    }

    // Prepare the updates object
    const allowedUpdates: Partial<Document> = {
      title: updates.title,
      content: updates.content,
      coverImage: updates.coverImage,
      icon: updates.icon,
      isPublished: updates.isPublished,
      isArchived: updates.isArchived,
    };

    // Remove undefined properties
    const cleanUpdates = Object.fromEntries(
      Object.entries(allowedUpdates).filter(([_, v]) => v !== undefined)
    );

    await updateDoc(docRef, cleanUpdates);

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Unknown error" };
  }
}

export async function removeDocumentIcon(
  id: string
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    // Get the document first to verify ownership
    const docRef = doc(db, "documents", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return { success: false, error: "Document not found" };
    }

    const documentData = docSnap.data() as Document;
    if (documentData.userId !== user.uid) {
      return { success: false, error: "Unauthorized access" };
    }

    // Set the icon to undefined to remove it
    await updateDoc(docRef, {
      icon: null,
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Unknown error" };
  }
}

export async function uploadCover(
  documentId: string,
  file: File
): Promise<{ success: true; url: string } | { success: false; error: string }> {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    // Verify document ownership
    const docRef = doc(db, "documents", documentId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return { success: false, error: "Document not found" };
    }

    const documentData = docSnap.data() as Document;
    if (documentData.userId !== user.uid) {
      return { success: false, error: "Unauthorized access" };
    }

    // Delete old cover if exists
    if (documentData.coverImage) {
      try {
        const oldCoverRef = ref(storage, documentData.coverImage);
        await deleteObject(oldCoverRef);
      } catch (error) {
        console.warn("Failed to delete old cover image", error);
        // Continue with upload even if old image deletion fails
      }
    }

    // Create storage reference
    const storagePath = `notion/cover/${documentId}/${Date.now()}-${file.name}`;
    const storageRef = ref(storage, storagePath);

    // Upload file
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Update document with cover URL
    await updateDoc(docRef, {
      coverImage: downloadURL,
    });

    return { success: true, url: downloadURL };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to upload cover" };
  }
}

export async function removeCover(
  documentId: string
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    // Verify document ownership
    const docRef = doc(db, "documents", documentId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return { success: false, error: "Document not found" };
    }

    const documentData = docSnap.data() as Document;
    if (documentData.userId !== user.uid) {
      return { success: false, error: "Unauthorized access" };
    }

    // Delete cover image from storage if exists
    if (documentData.coverImage) {
      try {
        const coverRef = ref(storage, documentData.coverImage);
        await deleteObject(coverRef);
      } catch (error) {
        console.warn("Failed to delete cover image from storage", error);
        // Continue with removing the reference even if storage deletion fails
      }
    }

    // Remove cover reference from document
    await updateDoc(docRef, {
      coverImage: null,
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to remove cover" };
  }
}
