import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { PostService } from 'src/app/services/post.service';
import { global } from 'src/app/services/global';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  providers: [UserService, PostService],
})
export class ProfileComponent implements OnInit {
  public userId: any;
  public userInfo: any;
  public status: string;
  public identity: any;
  public url: any;
  public token: any;
  public posts: any;
  public postID: any;

  constructor(
    private _route: ActivatedRoute,
    private _userService: UserService,
    private _postService: PostService
  ) {
    this.token = this._userService.getToken();
    this.identity = this._userService.getIdentity();
    this.status = '';
    this.url = global.url;
  }

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      this.userId = params['id'];
    });
    this.getPosts(this.userId);
    this.getUserDetails(this.userId);
  }

  getUserDetails(id: any) {
    this._userService.getDetails(id).subscribe(
      (response) => {
        this.userInfo = response.user;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  postSelected(id: any) {
    this.postID = id;
  }

  deletePost(id: any) {
    this._postService.delete(this.token, id).subscribe(
      (response) => {
        this.postID = '';
      },
      (error) => {
        this.status = 'error';
        console.log(<any>error);
      }
    );
  }

  getPosts(id: any) {
    this._userService.getPostsFromUser(id).subscribe(
      (response) => {
        this.posts = response.posts;
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
