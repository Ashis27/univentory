import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertmodalpopupComponent } from 'src/app/shared/component/alertmodalpopup/alertmodalpopup.component';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ConsumerService } from './consumer.service';

@Component({
  selector: 'app-consumers',
  templateUrl: './consumers.component.html',
  styleUrls: ['./consumers.component.scss']
})
export class ConsumersComponent implements OnInit {
  paginatedItems = {
    items: [],
    TotalCount: 0,
    TotalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false
  }
  isAvaileble: boolean = true;
  title: string = "Consumers";
  searchConsumerKeyword: string = '';
  pageIndex: number = 1;
  pageSize: number = 10;

  constructor(private consumerService: ConsumerService, private notification: NotificationService,
    public router: Router) { }

  ngOnInit(): void {
    this.getConsumers();
  }

  getConsumers() {
    this.consumerService.getConsumers(this.searchConsumerKeyword, this.pageIndex, this.pageSize)
      .subscribe((data: any) => {
        if (data && data.items.length == 0) {
          this.isAvaileble = false;
        }
        this.paginatedItems = data;
      },
        error => {
          this.isAvaileble = false;
          return this.notification.errorMessage(error);
        });
  }

  addConsumer() {
    this.router.navigate(['/service/create-consumer']);
  }

  getConsumerHistory(id) {
    this.router.navigate(['/service/sell-history'], {
      state: { consumerId: id }
    });
  }

  editConsumer(item) {
    this.router.navigate(['/service/edit-consumer'], {
      state: { consumerData: item }
    });
  }

  prev() {
    if (!this.paginatedItems.hasPreviousPage)
      return;

    this.pageIndex = this.pageIndex - 1;
    this.getConsumers();
  }
  next() {
    if (!this.paginatedItems.hasNextPage)
      return;

    this.pageIndex = this.pageIndex + 1;
    this.getConsumers();
  }
}
