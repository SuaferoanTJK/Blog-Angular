import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/models/category';

@Component({
  selector: 'app-category-new',
  templateUrl: './category-new.component.html',
  providers: [UserService, CategoryService],
})
export class CategoryNewComponent implements OnInit {
  public page_title: string;
  public paragraph: string;
  public token: any;
  public identity: any;
  public category: Category;
  public status: string;

  constructor(
    private _userService: UserService,
    private _categoryService: CategoryService
  ) {
    this.page_title = 'Create category';
    this.paragraph = 'With a new category you can create posts related to it';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.category = new Category(1, '');
    this.status = '';
  }

  ngOnInit(): void {}

  onSubmit(form: any) {
    this._categoryService.create(this.token, this.category).subscribe(
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
