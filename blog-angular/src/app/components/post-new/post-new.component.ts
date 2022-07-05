import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post';
import { UserService } from 'src/app/services/user.service';
import { CategoryService } from 'src/app/services/category.service';
import { PostService } from 'src/app/services/post.service';
import { global } from 'src/app/services/global';

@Component({
  selector: 'post-new',
  templateUrl: './post-new.component.html',
  providers: [UserService, CategoryService, PostService],
})
export class PostNewComponent implements OnInit {
  public page_title: string;
  public paragraph: string;
  public submit_text: string;
  public status: string;
  public token: any;
  public identity: any;
  public post: Post;
  public file: any;
  public url: any;
  public categories: any;
  public isEdit: boolean;

  constructor(
    private _userService: UserService,
    private _categoryService: CategoryService,
    private _postService: PostService
  ) {
    this.page_title = 'Create post';
    this.paragraph = 'Create a post related to a specific category';
    this.submit_text = 'Create';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.post = new Post(1, this.identity.sub, 1, '', '', null, null);
    this.status = '';
    this.url = global.url;
    this.categories = [];
    this.isEdit = false;
  }

  ngOnInit(): void {
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

  onSubmit(form: any) {
    let formData = new FormData();
    formData.set('file0', this.file);
    if (this.file && this.file != 'undefined') {
      this._postService.uploadImage(this.token, formData).subscribe(
        (response) => {
          this.post.image = response.image;
          this._postService.create(this.token, this.post).subscribe(
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
        },
        (error) => {
          console.log(<any>error);
        }
      );
    }
  }
}
