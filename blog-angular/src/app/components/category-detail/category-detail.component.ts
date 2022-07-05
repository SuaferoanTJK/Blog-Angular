import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { CategoryService } from 'src/app/services/category.service';
import { PostService } from 'src/app/services/post.service';
import { global } from 'src/app/services/global';

@Component({
  selector: 'category-detail',
  templateUrl: './category-detail.component.html',
  providers: [UserService, CategoryService, PostService],
})
export class CategoryDetailComponent implements OnInit {
  public url: any;
  public categoryID: any;
  public status: string;
  public category: any;
  public posts: any;
  public identity: any;
  public token: any;
  public postID: any;

  constructor(
    private _userService: UserService,
    private _categoryService: CategoryService,
    private _postService: PostService,
    private _route: ActivatedRoute
  ) {
    this.status = '';
    this.url = global.url;
    this.category = {};
    this.posts = [];
    this.postID = '';
  }

  ngOnInit(): void {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.getPostByCategory();
  }

  getPostByCategory() {
    this._route.params.subscribe((params) => {
      this.categoryID = params['id'];
      this._categoryService.getCategory(this.categoryID).subscribe(
        (response) => {
          if (response.status == 'success') {
            this.category = response.category;
            this.getPosts(this.categoryID);
          } else {
            this.status = 'error';
          }
        },
        (error) => {
          console.log(error);
        }
      );
    });
  }

  postSelected(id: any) {
    this.postID = id;
  }

  getPosts(id: any) {
    this._categoryService.getPostsFromCategory(id).subscribe(
      (response) => {
        if (response.status == 'success') {
          this.posts = response.posts;
        }
      },
      (error) => {
        this.status = 'error';
        console.log(<any>error);
      }
    );
  }

  deletePost(id: any) {
    this._postService.delete(this.token, id).subscribe(
      (response) => {
        this.getPosts(this.categoryID);
        this.postID = '';
      },
      (error) => {
        this.status = 'error';
        console.log(<any>error);
      }
    );
  }
}
