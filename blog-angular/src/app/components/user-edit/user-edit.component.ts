import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { global } from 'src/app/services/global';

@Component({
  selector: 'user-edit',
  templateUrl: './user-edit.component.html',
  providers: [UserService],
})
export class UserEditComponent implements OnInit {
  public page_title: string;
  public paragraph: string;
  public user: User;
  public status: string;
  public token: any;
  public identity: any;
  public file: any;
  public url: any;

  constructor(private _userService: UserService) {
    this.page_title = 'User Settings';
    this.paragraph = 'Update the info from your profile that you desire';
    this.status = '';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.user = new User(
      this.identity.sub,
      this.identity.name,
      this.identity.surname,
      this.identity.role,
      this.identity.email,
      this.identity.password,
      this.identity.description,
      this.identity.image
    );
    this.url = global.url;
  }

  ngOnInit(): void {}

  uploadFile(event: any) {
    this.file = event.target.files[0];
  }

  onSubmit(form: any) {
    let formData = new FormData();
    formData.set('file0', this.file);
    if (this.file && this.file != 'undefined') {
      this._userService.uploadImage(this.token, formData).subscribe(
        (response) => {
          this.user.image = response.image;
        },
        (error) => {
          console.log(<any>error);
        }
      );
    }
    this._userService.update(this.token, this.user).subscribe(
      (response) => {
        if (response.status == 'success') {
          this.status = 'success';
          if (response.changes.name) {
            this.user.name = response.changes.name;
          }
          if (response.changes.surname) {
            this.user.surname = response.changes.surname;
          }
          if (response.changes.email) {
            this.user.email = response.changes.email;
          }
          if (response.changes.description) {
            this.user.description = response.changes.description;
          }
          this.identity = this.user;
          localStorage.setItem('identity', JSON.stringify(this.identity));
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
