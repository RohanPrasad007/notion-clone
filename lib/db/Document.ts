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
    const newDoc: Omit<Document, "_id"> = {
      title,
      userId: user.uid,
      isArchived: false,
      isPublished: false,
      parentDocument: parentDocument ?? null,
    };
    const docRef = await addDoc(collection(db, "documents"), newDoc);

    return { success: true, id: docRef.id };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
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
      q = query(
        collection(db, "documents"),
        where("userId", "==", user.uid),
        where("isArchived", "==", false),
        where("parentDocument", "==", null)
      );
    } else {
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
    await updateDoc(doc(db, "documents", id), { isArchived: true });
    const childrenSnap = await getDocs(
      query(collection(db, "documents"), where("parentDocument", "==", id))
    );
    const childIds = childrenSnap.docs.map((d) => d.id);
    await Promise.all(
      childIds.map((childId) => archiveDocumentRecursive(childId))
    );
    return true;
  } catch (error) {
    console.error("Archive error:", error);
    return false;
  }
}

export async function restoreDocumentRecursive(id: string): Promise<boolean> {
  try {
    const docRef = doc(db, "documents", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return false;

    const data = docSnap.data() as Document;
    let parentShouldBeNull = false;

    if (data.parentDocument) {
      const parentRef = doc(db, "documents", data.parentDocument);
      const parentSnap = await getDoc(parentRef);
      parentShouldBeNull = !parentSnap.exists() || parentSnap.data().isArchived;
    }

    await updateDoc(docRef, {
      isArchived: false,
      parentDocument: parentShouldBeNull ? null : data.parentDocument ?? null,
    });

    const childrenSnap = await getDocs(
      query(collection(db, "documents"), where("parentDocument", "==", id))
    );
    const childIds = childrenSnap.docs.map((d) => d.id);
    await Promise.all(
      childIds.map((childId) => restoreDocumentRecursive(childId))
    );

    return true;
  } catch (error) {
    console.error("Restore error:", error);
    return false;
  }
}

export async function deleteDocument(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, "documents", id));
    return true;
  } catch (error) {
    console.error("Delete error:", error);
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
          setDocument(null);
          setError("Document not found");
          setLoading(false);
          return;
        }

        const data = { _id: docSnap.id, ...docSnap.data() } as Document;
        const user = auth.currentUser;

        if (data.isPublished && !data.isArchived) {
          setDocument(data);
          setError(null);
        } else if (user?.uid === data.userId) {
          setDocument(data);
          setError(null);
        } else {
          setDocument(null);
          setError("Unauthorized access");
        }
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
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

    const docRef = doc(db, "documents", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return { success: false, error: "Document not found" };
    }

    const documentData = docSnap.data() as Document;
    if (documentData.userId !== user.uid) {
      return { success: false, error: "Unauthorized access" };
    }

    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter((entry) => entry[1] !== undefined)
    );

    await updateDoc(docRef, cleanUpdates);
    return { success: true };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
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

    const docRef = doc(db, "documents", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return { success: false, error: "Document not found" };
    }

    const documentData = docSnap.data() as Document;
    if (documentData.userId !== user.uid) {
      return { success: false, error: "Unauthorized access" };
    }

    await updateDoc(docRef, { icon: null });
    return { success: true };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
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

    const docRef = doc(db, "documents", documentId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return { success: false, error: "Document not found" };
    }

    const documentData = docSnap.data() as Document;
    if (documentData.userId !== user.uid) {
      return { success: false, error: "Unauthorized access" };
    }

    if (documentData.coverImage) {
      try {
        await deleteObject(ref(storage, documentData.coverImage));
      } catch (error) {
        console.warn("Failed to delete old cover image", error);
      }
    }

    const storagePath = `covers/${documentId}/${Date.now()}-${file.name}`;
    const storageRef = ref(storage, storagePath);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    await updateDoc(docRef, { coverImage: downloadURL });
    return { success: true, url: downloadURL };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload cover",
    };
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

    const docRef = doc(db, "documents", documentId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return { success: false, error: "Document not found" };
    }

    const documentData = docSnap.data() as Document;
    if (documentData.userId !== user.uid) {
      return { success: false, error: "Unauthorized access" };
    }

    if (documentData.coverImage) {
      try {
        await deleteObject(ref(storage, documentData.coverImage));
      } catch (error) {
        console.warn("Failed to delete cover image", error);
      }
    }

    await updateDoc(docRef, { coverImage: null });
    return { success: true };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to remove cover",
    };
  }
}
