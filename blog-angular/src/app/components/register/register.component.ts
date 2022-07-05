import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  providers: [UserService],
})
export class RegisterComponent implements OnInit {
  public page_title: string;
  public paragraph: string;
  public user: User;
  public status: string;

  constructor(private _userService: UserService) {
    this.page_title = 'Register';
    this.paragraph = 'Register in our platform to create new posts and more';
    this.user = new User(1, '', '', 'ROLE_USER', '', '', '', '');
    this.status = '';
  }

  ngOnInit(): void {}

  onSubmit(form: any) {
    this._userService.register(this.user).subscribe(
      (response) => {
        if (response.status == 'success') {
          this.status = response.status;
          form.reset();
        } else {
          this.status = 'error';
        }
      },
      (error) => {
        this.status = 'error';
        console.log(<any>error);
      }
    );
  }
}
