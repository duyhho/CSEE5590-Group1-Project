import { Component, OnInit } from '@angular/core';
import { UserService } from '../user/user.service';
import { User } from '../user/user.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  users: User[];
  constructor(private userService: UserService) { }

  ngOnInit() {
    this.users = [];

    this.userService.getUsers().subscribe(data => {
      this.users = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as User;
      });
    });
  }

  create(user: User) {
    this.userService.createUser(user);
  }

  update(user: User) {
    this.userService.updateUser(user);
  }

  delete(id: string) {
    this.userService.deleteUser(id);
  }

  getSortedScores() {
    return this.users.sort((a: User, b: User) => a.score > b.score ? -1 : b.score > a.score ? 1 : 0).slice(0, 10);
  }

  getFormattedDate(timestamp) {
    const date = new Date(1970, 0, 0);
    date.setSeconds(timestamp.seconds);

    return date.toDateString()
      .split(' ')
      .slice(1)
      .join(' ');
  }
}
