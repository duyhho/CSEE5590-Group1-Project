import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {User} from 'src/app/user/user.model';
import * as firebase from 'firebase';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private firestore: AngularFirestore) {
  }

  getUsers(): Observable<User[]> {
    return this.firestore.collection('users').snapshotChanges().pipe(
      map(changes =>
        changes.map(e =>
          ({id: e.payload.doc.id, ...e.payload.doc.data()} as User)
        ).sort((a: User, b: User) => a.score > b.score ? -1 : b.score > a.score ? 1 : 0).slice(0, 10)
      )
    );
  }

  createUser(user: User) {
    user.timestamp = firebase.firestore.FieldValue.serverTimestamp();
    return this.firestore.collection('users').add(user);
  }

  updateUser(user: User) {
    delete user.id;
    this.firestore.doc(`users/${user.id}`).update(user);
  }

  deleteUser(id: string) {
    this.firestore.doc(`users/${id}`).delete();
  }
}

