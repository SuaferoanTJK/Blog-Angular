import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { PostService } from 'src/app/services/post.service';
import { global } from 'src/app/services/global';

@Component({
  selector: 'post-detail',
  templateUrl: './post-detail.component.html',
  providers: [UserService, PostService],
})
export class PostDetailComponent implements OnInit {
  public post: any;
  public url: any;
  public id: any;
  public status: string;
  public identity: any;

  constructor(
    private _userService: UserService,
    private _postService: PostService,
    private _route: ActivatedRoute
  ) {
    this.post = {};
    this.url = global.url;
    this.status = '';
    this.id = '';
    this.identity = this._userService.getIdentity();
  }

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      this.id = params['id'];
      this.getPost(this.id);
    });
  }

  getPost(id: any) {
    this._postService.getPost(id).subscribe(
      (response) => {
        if (response.status == 'success') {
          this.post = response.post;
        }
      },
      (error) => {
        this.status = 'error';
        console.log(<any>error);
      }
    );
  }
}
