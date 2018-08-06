import { Component } from '@angular/core'; 
import { NavParams, ViewController } from 'ionic-angular';
import { PlaceModel } from '../../models/place.model';
import { PlacesService } from '../../services/places.service';

@Component({
  selector: 'page-place',
  templateUrl: 'place.html',
})
export class PlacePage {

  place: PlaceModel;
  places: PlaceModel[] = [];
  index: number;

  constructor(private navParams: NavParams, private viewCtrl: ViewController, private placesService: PlacesService){
    this.place = this.navParams.get('place');
    this.index = this.navParams.get('index');
  }
  
  onLeave(){
    this.viewCtrl.dismiss({contacts: this.placesService.loadPlaces()});
  }

  onDelete(){
    this.placesService.deletePlace(this.index);
    this.onLeave();
  }


}
