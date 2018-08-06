import { Injectable } from "@angular/core";
import { PlaceModel } from "../models/place.model";
import { LocationModel } from "../models/location.model";
import { File } from '@ionic-native/file';

import { Storage } from '@ionic/storage';

declare var cordova: any;

@Injectable()
export class PlacesService{
    private places: PlaceModel[] = [];

    constructor(private storage: Storage, private file: File){
        
    }

    addPlace(title: string, description: string, location: LocationModel, imageUrl: string, dateTime: string){
        const place = new PlaceModel(title, description, location, imageUrl, dateTime);
        this.places.push(place);
        this.storage.set('places', this.places)
        .then()
        .catch(
            err => {
                this.places.splice(this.places.indexOf(place), 1);
            }
        )
    }

    loadPlaces(){
        return this.places.slice();
    }

    fetchPlaces(){
        return this.storage.get('places')
        .then(
            (places: PlaceModel[]) => {
                this.places = places != null ? places: [];
                return this.places;
            }
        )
        .catch()

    }

    deletePlace(index: number){
        const place = this.places[index];
        this.places.splice(index, 1);
        this.storage.set('places', this.places)
        .then(
            () => {
                this.removeFile(place)
            }
        )
        .catch(
            err => console.log(err)
        );
    }

    removeFile(place: PlaceModel){
        const currentName = place.imageUrl.replace(/^.*[\\\/]/, '');
        this.file.removeFile(cordova.file.dataDirectory, currentName)
        .then(
            () => console.log('Removed file')
        )
        .catch(
            () => {
                console.log('Error while removing File');
                this.addPlace(place.title, place.description, place.location, place.imageUrl, place.dateTime);
            }
        )
    }
}