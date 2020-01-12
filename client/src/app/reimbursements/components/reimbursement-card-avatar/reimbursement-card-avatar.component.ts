import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-reimbursement-card-avatar',
  templateUrl: './reimbursement-card-avatar.component.html',
  styleUrls: ['./reimbursement-card-avatar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReimbursementCardAvatarComponent implements OnInit {

  @Input('status') status: number;
  @Input('type') type: number;

  constructor() { }

  ngOnInit() {
  }

  getStatusIcon(status: number): string {
    switch (status) {
      case 0:
        return "cached";
      case 1:
        return "done";
      case 2:
        return "clear";
      default:
        return "error"
    }
  }

  getTypeIcon(type: number): string {
    switch (type) {
      case 0:
        return "home";
      case 1:
        return "airplanemode_active";
      case 2:
        return "local_gas_station";
      case 3:
        return "fastfood";
      case 4:
        return "description";
      default:
        return "error";
    }
  }

  getIconStyle(status: number): any {
    switch (status) {
      case 0:
        return { color: 'yellow' };
      case 1:
        return { color: 'green' };
      case 2:
        return { color: 'red' };
      default:
        return { color: 'orange' };
    }
  }
}
