import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Dictionary } from '@ngrx/entity';
import { PageRequest } from 'src/app/models/page-request.model';
import { pagedTableConfig } from './users-table.config';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: [`./table.component.scss`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent<T> implements OnChanges {
  initialConfig = pagedTableConfig;
  dataSource: MatTableDataSource<T>;
  dataToDisplay: T[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @Input() fetchError: string;
  @Input() isLoading: boolean;
  @Input() dataByPage: Dictionary<T[]>;
  @Input() dataLength: number;
  @Input() columnsBoundValues: string[];
  @Input() columnDisplayNames: string[];

  @Output() pageSwitched = new EventEmitter<PageRequest<T>>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataByPage) {
      this.dataToDisplay = this.paginator && this.dataByPage[this.paginator.pageIndex];
      this.dataSource = new MatTableDataSource(this.dataToDisplay);
      this.dataSource.sort = this.sort;
    }
    if (changes.fetchError && this.fetchError) {
      alert(this.fetchError);
    }
  }

  getPage() {
    const { itemsPerFetch, pageSize } = pagedTableConfig;
    this.pageSwitched.emit({ itemsPerFetch: pageSize + 1, pageSize, pageNumber: this.paginator.pageIndex });
  }
}
