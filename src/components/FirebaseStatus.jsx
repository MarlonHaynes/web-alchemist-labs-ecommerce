import { auth, db } from "../firebase/config";

export default function FirebaseStatus() {
  const firebaseReady = Boolean(auth) && Boolean(db);

  return (
    <div className="firebase-status">
      <span className="firebase-status-label">Firebase Status</span>
      <strong
        className={
          firebaseReady
            ? "firebase-status-value success"
            : "firebase-status-value error"
        }
      >
        {firebaseReady ? "Connected" : "Not Connected"}
      </strong>
    </div>
  );
}