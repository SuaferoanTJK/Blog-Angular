import { Component, OnInit, DoCheck } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { global } from 'src/app/services/global';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService],
})
export class AppComponent implements OnInit, DoCheck {
  public title = 'Blog';
  public identity: any;
  public token: any;
  public url: any;

  constructor(private _userService: UserService) {
    this.loadUser();
    this.url = global.url;
  }

  ngOnInit(): void {
    console.log('App loaded');
  }

  ngDoCheck(): void {
    this.loadUser();
  }

  loadUser() {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }
}
