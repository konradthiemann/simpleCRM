import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  currentUserId: any;
  currentDoc: any;
  currentUserFirstName: any;
  currentUserLastName: any;
  currentUserEmail: any;

  constructor() { }

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
}
