import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-campaigns',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './campaigns.component.html',
  styleUrl: './campaigns.component.css'
})
export class CampaignsComponent {


  currentIndex = 0;

 


  campaigns= [
    {
      imageUrl: 'https://www.asus.com/media/Odin/Websites/eg-en/SiteSetting/20240408072220.jpg?webp',
      title: 'ASUS x Boosteroid Cloud Gaming Discount Redemption'
    
    },
    {
      imageUrl: 'https://www.asus.com/media/Odin/Websites/eg-en/SiteSetting/20231211040939.jpg?webp',
      title: 'ASUS and AMD have teamed up to provide an incredible game bundle!'
    },
    {
      imageUrl: 'https://www.asus.com/media/Odin/Websites/eg-en/SiteSetting/20220320061338.jpg?webp',
      title: 'Show Your Prime Giveaway'
    }
  ];


  nextImage() {
    this.currentIndex = (this.currentIndex + 1) % this.campaigns.length;
  }


}
