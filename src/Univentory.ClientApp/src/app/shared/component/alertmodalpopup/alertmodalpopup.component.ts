import { Component, OnInit, ViewChild, Output, EventEmitter, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-alertmodalpopup',
  templateUrl: './alertmodalpopup.component.html',
  styleUrls: ['./alertmodalpopup.component.sass']
})
export class AlertmodalpopupComponent implements OnInit {
  @ViewChild('alertConfirmationModal') modal: ModalDirective;
  @ViewChild('modalContent') modalContent: ElementRef;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  selectedText: string = '';
  type: string = '';
  
  constructor() { }

  ngOnInit(): void {
  }

  show(value, type): void {
    this.selectedText = value;
    this.type = type;
    this.modal.show();
  }

  confirm() {
    this.close();
    this.modalSave.emit();
  }

  close() {
    this.modal.hide();
  }



}
