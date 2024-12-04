import { Component } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { ProductsService } from '../../services/products.service';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [RouterLink],
  template: `
    @for (item of catagories; track $index) {
    <li class="nav-item">
      <a
        class="nav-link"
        aria-current="page"
        
        [routerLink]="['/products/category/' + item.category.en]"
        >{{ item.category[lang] }}</a
      >
    </li>
    }
  `,
})
export class CategoriesComponent {
  catagories!: any;
  lang!: string;
  private langChangeSub!: Subscription;
  constructor(
    public language: LanguageService,
    private productObj: ProductsService
  ) {}
  ngOnInit(): void {
    this.langChangeSub = this.language.onLangChange.subscribe(() => {
      this.lang = this.language.getCurrentLanguageValue();
    });
    this.fetchCatagories();
  }
  ngOnDestroy(): void {
    if (this.langChangeSub) {
      this.langChangeSub.unsubscribe();
    }
  }
  fetchCatagories(): void {
    this.productObj.getCategories().subscribe((data) => {
      this.catagories = data;
    });
  }
}
