import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  currentUserId: any;
  currentDoc: any;
  currentUserFirstName: any;
  currentUserLastName: any;
  currentUserEmail: any;

  constructor(private firestore: AngularFirestore,) { }

  setCurrentUserInfo(id: any, doc: any) {
    this.currentUserId = id;
    this.currentDoc = doc;
    this.currentUserFirstName = doc.get('firstName');
    this.currentUserLastName = doc.get('lastName');
    this.currentUserEmail = doc.get('email');
  }

  getCurrentUserFirstName() {
    return this.currentUserFirstName;
  }

  getCurrentUserLastName() {
    return this.currentUserLastName;
  }

  getCurrentUserId() {
    return this.currentUserId;
  }

  getCurrentDoc() {
    return this.currentDoc;
  }

  getCurrentEmail() {
    return this.currentUserEmail;
  }

  getUsers(): Observable<any[]> {
    return this.firestore.collection('users').valueChanges();
  }
}
