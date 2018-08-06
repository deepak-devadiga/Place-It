import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import {
  ModalController,
  LoadingController,
  ToastController,
  NavController
} from "ionic-angular";
import { SetLocationPage } from "../set-location/set-location";
import { LocationModel } from "../../models/location.model";
import { Geolocation } from "@ionic-native/geolocation";
import { Camera } from "@ionic-native/camera";
import { File, Entry, FileError } from "@ionic-native/file";
import { PlacesService } from "../../services/places.service";

declare var cordova: any;

@Component({
  selector: "page-add-place",
  templateUrl: "add-place.html"
})
export class AddPlacePage {
  location: LocationModel = {
    lat: 13.3409,
    lng: 74.7421
  };

  locationIsSet = false;

  imageUrl = "";

  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private geolocation: Geolocation,
    private camera: Camera,
    private placesService: PlacesService,
    private file: File,
    private navCtrl: NavController
  ) {}

  onSubmit(form: NgForm) {
    const date = new Date();
    const dayTime = date.getHours() % 12 > 0 ? "PM" : "AM";
    const fullDate =
      date.getDate() +
      "/" +
      date.getMonth() +
      "/" +
      date.getFullYear() +
      ", " +
      (date.getHours() % 12) +
      ":" +
      date.getMinutes() +
      ":" +
      date.getSeconds() +
      " " +
      dayTime;

    this.placesService.addPlace(
      form.value.title,
      form.value.description,
      this.location,
      this.imageUrl,
      fullDate
    );
    form.reset();
    this.location = {
      lat: 13.3409,
      lng: 74.7421
    };
    this.imageUrl = "";
    this.locationIsSet = false;
    this.navCtrl.popToRoot();
  }

  onLocate() {
    const loader = this.loadingCtrl.create({
      content: "Fetching your location..."
    });
    loader.present();
    this.geolocation
      .getCurrentPosition()
      .then(location => {
        loader.dismiss();
        this.location.lat = location.coords.latitude;
        this.location.lng = location.coords.longitude;
        this.locationIsSet = true;
        console.log(location);
      })
      .catch(error => {
        loader.dismiss();
        const toast = this.toastCtrl.create({
          message: "Could not get location, please pick it automatically",
          duration: 2500
        });
        toast.present();
        console.log(error);
      });
  }

  onOpenMap() {
    const modal = this.modalCtrl.create(SetLocationPage, {
      location: this.location,
      isSet: this.locationIsSet
    });
    modal.present();
    modal.onDidDismiss(data => {
      if (data) {
        this.location = data.location;
        this.locationIsSet = true;
        console.log(this.location);
      }
    });
  }

  onTakePhoto() {
    this.camera
      .getPicture({
        encodingType: this.camera.EncodingType.JPEG,
        correctOrientation: true
      })
      .then(imageData => {
        const currentName = imageData.replace(/^.*[\\\/]/, "");
        const path = imageData.replace(/[^\/]*$/, "");
        const newFileName = new Date().getUTCMilliseconds() + ".jpg";
        this.file
          .moveFile(path, currentName, cordova.file.dataDirectory, newFileName)
          .then((data: Entry) => {
            this.imageUrl = data.nativeURL;
            this.camera.cleanup();
          })
          .catch((err: FileError) => {
            this.imageUrl = "";
            const toast = this.toastCtrl.create({
              message: "Could not save the image. Please try again!",
              duration: 2500
            });
            toast.present();
            this.camera.cleanup();
          });
        this.imageUrl = imageData;
      })
      .catch(err => {
        const toast = this.toastCtrl.create({
          message: "Could not open the camera!",
          duration: 2500
        });
        toast.present();
      });
  }
}
