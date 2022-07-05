import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { CategoryService } from 'src/app/services/category.service';
import { PostService } from 'src/app/services/post.service';
import { global } from 'src/app/services/global';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  providers: [UserService, CategoryService, PostService],
})
export class HomeComponent implements OnInit {
  public page_title: string;
  public status: string;
  public categories: any;
  public posts: any;
  public url: any;
  public identity: any;
  public token: any;
  public postID: any;

  constructor(
    private _userService: UserService,
    private _categoryService: CategoryService,
    private _postService: PostService
  ) {
    this.page_title = 'Home';
    this.status = '';
    this.url = global.url;
  }

  ngOnInit(): void {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.getCategories();
    this.getPosts();
  }

  getCategories() {
    this._categoryService.getCategories().subscribe(
      (response) => {
        if (response.status == 'success') {
          this.categories = response.categories;
        }
      },
      (error) => {
        this.status = 'error';
        console.log(<any>error);
      }
    );
  }

  getPosts() {
    this._postService.getPosts().subscribe(
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

  postSelected(id: any) {
    this.postID = id;
  }

  deletePost(id: any) {
    this._postService.delete(this.token, id).subscribe(
      (response) => {
        this.getPosts();
        this.postID = '';
      },
      (error) => {
        this.status = 'error';
        console.log(error);
      }
    );
  }
}
