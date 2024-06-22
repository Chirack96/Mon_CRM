import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CalendarEvent, CalendarView, CalendarModule } from 'angular-calendar';
import { startOfDay } from 'date-fns';

@Component({
  selector: 'app-schedule-calendar',
  templateUrl: './schedule-calendar.component.html',
  styleUrls: ['./schedule-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CalendarModule],  // Ensure CalendarModule is imported correctly
  standalone: true
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

  dayClicked({ day, sourceEvent }: { day: any; sourceEvent: MouseEvent | KeyboardEvent }): void {
    console.log('Clicked on day:', day.date);
    if (day.events) {
      console.log('Events on this day:', day.events);
    }
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  protected readonly CalendarView = CalendarView;
}
