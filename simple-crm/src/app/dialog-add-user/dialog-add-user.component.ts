import { Component } from '@angular/core';
import { Firestore, addDoc, collection, doc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { User } from 'src/models/user.class';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-add-user',
  templateUrl: './dialog-add-user.component.html',
  styleUrls: ['./dialog-add-user.component.scss']
})
export class DialogAddUserComponent {

  constructor(
    private firestore: Firestore,
    public dialogRef: MatDialogRef<DialogAddUserComponent>,
  ) { }

  user: User = new User();
  birthDate: Date | undefined;
  loading: boolean = false;
  emailAlreadyTaken: boolean = false;

  async saveUser() {
    const isEmailTaken = await this.validateEmail(this.user.email);
  
    if (isEmailTaken) {
      this.emailAlreadyTaken = true;
    } else {
      this.emailAlreadyTaken = false; // Setze die Variable zurück, wenn die E-Mail nicht vergeben ist
  
      this.user.birthDate = this.birthDate?.getTime();
      this.loading = true;
      const usersCollectionRef = collection(this.firestore, 'users');
  
      addDoc(usersCollectionRef, this.user.toJSON()).then((result: any) => {
        const newUserId = result.id;
        const userDocRef = doc(usersCollectionRef, newUserId);
        updateDoc(userDocRef, { id: newUserId }).then(() => {
          this.loading = false;
          this.dialogRef.close();
        });
      });
    }
  }

  async validateEmail(email: any): Promise<boolean> {

    const usersCollectionRef = collection(this.firestore, 'users');
    const q = query(usersCollectionRef, where('email', '==', email));

    const querySnapshot = await getDocs(q);
    return querySnapshot.size > 0;
  }


    // Annahme: Hier führst du deine Validierungslogik und Prüfung auf Vorhandensein durch.
    // Wenn die E-Mail bereits vergeben ist, setze 'emailAlreadyTaken' auf 'true', sonst auf 'false'.
    // this.emailAlreadyTaken = true; // Beispiel, wie du die Variable setzen könntest.
    // return this.emailAlreadyTaken;
  
}
