import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';

export interface PromptData {
  name: string;
  score: number;
}

@Component({
  selector: 'app-username-prompt',
  templateUrl: './username-prompt.component.html',
  styleUrls: ['./username-prompt.component.css']
})
export class UsernamePromptComponent implements OnInit {

  username = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: PromptData) {
  }

  get user() {
    return Object.assign({}, this.data, {name: this.username});
  }

  ngOnInit() {
  }

}
