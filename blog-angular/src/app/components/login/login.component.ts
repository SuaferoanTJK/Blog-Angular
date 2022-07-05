import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  providers: [UserService],
})
export class LoginComponent implements OnInit {
  public page_title: string;
  public paragraph: string;
  public user: User;
  public status: string;
  public token: any;
  public identity: any;

  constructor(
    private _userService: UserService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.page_title = 'Log in';
    this.paragraph =
      'Create and manage your posts as soon as you are logged in';
    this.user = new User(1, '', '', 'ROLE_USER', '', '', '', '');
    this.status = '';
  }

  ngOnInit(): void {
    this.logout();
  }

  onSubmit(form: any) {
    this._userService.signup(this.user).subscribe(
      (response) => {
        if (response.status != 'error') {
          this.status = 'success';
          this.token = response;

          this._userService.signup(this.user, true).subscribe(
            (response) => {
              this.identity = response;
              localStorage.setItem('token', this.token);
              localStorage.setItem('identity', JSON.stringify(this.identity));
              form.reset();
              this._router.navigate(['home']);
            },
            (error) => {
              console.log(<any>error);
              this.status = 'error';
            }
          );
        } else {
          this.status = 'error';
        }
      },
      (error) => {
        console.log(<any>error);
        this.status = 'error';
      }
    );
  }

  logout() {
    this._route.params.subscribe((params) => {
      let logout = +params['sure'];
      if (logout == 1) {
        localStorage.removeItem('identity');
        localStorage.removeItem('token');
        this.identity = null;
        this.token = null;

        this._router.navigate(['home']);
      }
    });
  }
}
