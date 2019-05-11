import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from 'src/app/user/user.model';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private firestore: AngularFirestore) { }

  getUsers() {
    return this.firestore.collection('users').snapshotChanges();
  }

  createUser(user: User) {
    user.timestamp = firebase.firestore.FieldValue.serverTimestamp();
    return this.firestore.collection('users').add(user);
  }

  updateUser(user: User) {
    delete user.id;
    this.firestore.doc('users/' + user.id).update(user);
  }

  deleteUser(id: string) {
    this.firestore.doc('users/' + id).delete();
  }
}

