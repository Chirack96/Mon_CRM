import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CalendarEvent, CalendarView, CalendarModule } from 'angular-calendar';
import { startOfDay } from 'date-fns';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-schedule-calendar',
  templateUrl: './schedule-calendar.component.html',
  styleUrls: ['./schedule-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CalendarModule, NgIf]
})
export class ScheduleCalendarComponent {
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [
    {
      start: startOfDay(new Date()),
      title: 'An event',
      color: {
        primary: '#1e90ff',
        secondary: '#D1E8FF'
      }
    }
  ];

  setView(view: CalendarView) {
    this.view = view;
  }

  dayClicked(event: any): void {
    console.log('Day clicked', event);
  }

  eventClicked(event: any): void {
    console.log('Event clicked', event);
  }

  protected readonly CalendarView = CalendarView;
}
