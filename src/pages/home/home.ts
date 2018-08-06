import { Component, OnInit } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { AddPlacePage } from '../add-place/add-place';
import { PlaceModel } from '../../models/place.model';
import { PlacesService } from '../../services/places.service';
import { PlacePage } from '../place/place';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit{

  addPlacePage = AddPlacePage;
  places : PlaceModel[] = [];

  constructor(private modalCtrl: ModalController, private placesService: PlacesService) {
    
  }

  ionViewWillEnter(){
    this.places = this.placesService.loadPlaces();
  }

  onOpenPlace(place: PlaceModel, index: number){
    const modal = this.modalCtrl.create(PlacePage, {place: place, index: index});
    modal.present();
    modal.onDidDismiss(
      (data) => {
        this.places = data.contacts;
      }
    )
  }

  ngOnInit(){
    this.placesService.fetchPlaces()
      .then(
        (places: PlaceModel[]) => this.places = places
      );
  }
}
