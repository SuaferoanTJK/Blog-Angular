import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/models/post';
import { UserService } from 'src/app/services/user.service';
import { CategoryService } from 'src/app/services/category.service';
import { PostService } from 'src/app/services/post.service';
import { global } from 'src/app/services/global';

@Component({
  selector: 'post-edit',
  templateUrl: '../post-new/post-new.component.html',
  providers: [UserService, CategoryService, PostService],
})
export class PostEditComponent implements OnInit {
  public page_title: string;
  public paragraph: string;
  public submit_text: string;
  public status: string;
  public token: any;
  public identity: any;
  public post: Post;
  public id: any;
  public file: any;
  public url: any;
  public categories: any;
  public isEdit: boolean;

  constructor(
    private _userService: UserService,
    private _categoryService: CategoryService,
    private _postService: PostService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.page_title = 'Update Post';
    this.paragraph = 'Update the info from the post that you desire';
    this.submit_text = 'Update';
    this.status = '';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.post = new Post(1, this.identity.sub, 1, '', '', null, null);
    this.categories = [];
    this.url = global.url;
    this.isEdit = true;
  }

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      this.id = params['id'];
      this.getPost(this.id);
    });
    this.getCategories();
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

  uploadFile(event: any) {
    this.file = event.target.files[0];
  }

  getPost(id: any) {
    this._postService.getPost(id).subscribe(
      (response) => {
        if (response.status == 'success') {
          this.post = response.post;
          if (this.post.user_id != this.identity.sub) {
            this._router.navigate(['home']);
          }
        }
      },
      (error) => {
        this.status = 'error';
        console.log(<any>error);
      }
    );
  }

  onSubmit(form: any) {
    let formData = new FormData();
    formData.set('file0', this.file);
    if (this.file && this.file != 'undefined') {
      this._postService.uploadImage(this.token, formData).subscribe(
        (response) => {
          this.post.image = response.image;
        },
        (error) => {
          console.log(<any>error);
        }
      );
    }
    this._postService.update(this.token, this.post, this.post.id).subscribe(
      (response) => {
        if (response.status == 'success') {
          this.status = response.status;
          this._router.navigate(['home']);
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
