import { AfterContentInit, Component, ContentChildren, Directive, EventEmitter, Injector, Input, OnChanges, OnInit, Output, Pipe, PipeTransform, QueryList, SimpleChanges, TemplateRef } from '@angular/core';


@Directive({
    selector: '[pf2CellTemplate]'
})
export class Pf2CellTemplateDirective {
    @Input('pf2CellTemplate') name: string;

    constructor(public templateRef: TemplateRef<any>) { }
}


@Component({
    selector: 'app-table',
    imports: [],
    templateUrl: './table.component.html',
    styleUrl: './table.component.scss'
})
export class TableComponent implements OnInit, AfterContentInit, OnChanges {

    @ContentChildren(Pf2CellTemplateDirective) cellTemplates: QueryList<Pf2CellTemplateDirective>;
    @Input() data: DataSource;
    @Input() paginate = true;
    @Input() pageSize = 5;
    @Input() currentPage = 0;
    @Input() showFirstLast = true;
    @Input() sortable = false;
    @Input() multiFieldSort = false;
    @Input() fieldFilter = false;
    @Input() globalFilter = false;
    @Input() rowStyleField: string;
    @Input() expansionField: string;
    @Input() expansionTemplate: string;
    @Input() expandOnRowClick = false;
    @Input() noRowsMessage = 'No rows found.';
    @Input() selectionScheme = 'none';  // none | single | multiple
    @Input() rowKeyField;
    @Input() downloadCSV = false;
    @Input() tableId: string = `${Math.floor(Math.random() * 1000000000)}`;
    @Input() filterLabel = 'Filter';
    @Input() downloadLabel = 'CSV Download';

    // styling
    @Input() tableClasses: string;
    @Input() headerClasses: string;
    @Input() wrapperClasses: string;
    @Input() colFilterClasses: string;

    // icons

    @Output() rowClick: EventEmitter<Object> = new EventEmitter<Object>();
    @Output() rowExpanded: EventEmitter<Object> = new EventEmitter<Object>();
    @Output() rowCollapsed: EventEmitter<Object> = new EventEmitter<Object>();
    @Output() selectionChanged: EventEmitter<Object[] | Object> = new EventEmitter<Object[] | Object>();

    templateMap = {};
    filterMap = {};
    sortMap = {};
    selectionMap = {};
    sorts: Sort[] = [];
    globalFilterStr: string;
    expandedRow: any;
    toggleAllState = false;
    maxPageDisplay = 5;

    static getValueFromObj(field: string, obj: Object): any {
        if (!field || !obj) {
            return '';
        }

        for (const prop of field.split('.')) {
            obj = obj[prop];

            if (obj == null) {
                return '';
            }
        }

        return obj;
    }

    constructor() { }

    ngOnInit() {
        this.setPage(0);
    }

    ngAfterContentInit() {
        this.cellTemplates.forEach(cellTemplate => {
            this.templateMap[cellTemplate.name] = cellTemplate.templateRef;
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        const dataChange = changes['data'];
        if (dataChange !== undefined && !dataChange.isFirstChange()) {
            this.clearData();
            this.setPage(0);
        }
    }

    isFirst() {
        return this.currentPage === 0;
    }

    isLast() {
        return this.currentPage === this.pageCount() - 1;
    }

    pageCount() {
        return Math.ceil(this.data.totalSize / this.pageSize);
    }

    showPages() {
        const pages = [];
        if (this.pageCount() <= this.maxPageDisplay) { // if we can display them all, just do it
            for (let i = 0; i < this.pageCount(); i++) {
                pages.push(i);
            }
        } else if (this.currentPage < Math.ceil(this.maxPageDisplay / 2)) { // if we're close to the beginning, start from 0
            for (let i = 0; i < this.maxPageDisplay; i++) {
                pages.push(i);
            }
        } else if (this.pageCount() - this.currentPage < Math.ceil(this.maxPageDisplay / 2)) { // if we're close to the end, show the end
            for (let i = this.pageCount() - this.maxPageDisplay; i < this.pageCount(); i++) {
                pages.push(i);
            }
        } else { // the standad display with the active page in the middle
            for (let i = this.currentPage - Math.floor(this.maxPageDisplay / 2);
                i < this.currentPage + Math.floor(this.maxPageDisplay / 2) + 1; i++) {
                pages.push(i);
            }
        }
        return pages;
    }

    setPage(index: number) {
        this.currentPage = index;
        if (!this.paginate) {
            this.pageSize = this.data.totalSize;
        }
        const filterMap = this.filterMap;
        this.data.loadPage(this.currentPage * this.pageSize,
            this.pageSize,
            this.globalFilterStr,
            this.expansionField,
            Object.keys(filterMap).map(function (itm) { return filterMap[itm]; }),
            this.sorts);
        this.toggleAllState = false;
        return false;
    }

    setFieldFilter(col: Column, filter: string) {
        this.filterMap['' + this.data.columns.indexOf(col)] = { field: col.cellField, value: filter };
        this.setPage(0);
    }

    setGlobalFilter(filter: string) {
        this.globalFilterStr = filter;
        this.setPage(0);
    }

    getSort(col: Column): string {
        const sort = this.sortMap[col.cellField];
        if (!sort) {
            return 'none';
        }

        return sort.direction;
    }

    sortAsc(col: Column) {
        const sort = { field: col.cellField, direction: Direction.ASCENDING };

        if (!this.multiFieldSort) {
            this.sorts = [sort];
            this.sortMap = {};
            this.sortMap[col.cellField] = sort;
            this.setPage(this.currentPage);
            return false;
        }

        if (!this.sortMap[col.cellField]) {
            this.sorts.push(sort);
        } else {
            this.sorts[this.sorts.indexOf(this.sortMap[col.cellField])] = sort;
        }

        this.sortMap[col.cellField] = sort;
        this.setPage(this.currentPage);
        return false;
    }

    sortDesc(col: Column) {
        const sort = { field: col.cellField, direction: Direction.DESCENDING };

        if (!this.multiFieldSort) {
            this.sorts = [sort];
            this.sortMap = {};
            this.sortMap[col.cellField] = sort;
            this.setPage(this.currentPage);
            return false;
        }

        if (!this.sortMap[col.cellField]) {
            this.sorts.push(sort);
        } else {
            this.sorts[this.sorts.indexOf(this.sortMap[col.cellField])] = sort;
        }

        this.sortMap[col.cellField] = sort;
        this.setPage(this.currentPage);
        return false;
    }

    clearSort(col: Column) {
        this.sorts.splice(this.sorts.indexOf(this.sortMap[col.cellField]), 1);
        delete this.sortMap[col.cellField];
        this.setPage(this.currentPage);
        return false;
    }

    getRowStyle(row: any) {
        if (this.rowStyleField) {
            return TableComponent.getValueFromObj(this.rowStyleField, row);
        }

        return '';
    }

    getValue(columnIndex: number, row: Object) {
        const col = this.data.columns[columnIndex];

        if (!col) {
            return '';
        }

        return TableComponent.getValueFromObj(col.cellField, row);
    }

    expand(event: any, row: Object) {
        if (this.expandedRow) {
            this.rowCollapsed.emit(this.expandedRow);
        }
        this.expandedRow = row;
        this.rowExpanded.emit(row);
        if (event) {
            event.stopPropagation();
        }
    }

    collapse(event: any, row: Object) {
        this.expandedRow = null;
        this.rowCollapsed.emit(row);
        if (event) {
            event.stopPropagation();
        }
    }

    processRowClick(row: Object) {
        if (this.expandOnRowClick) {
            this.expand(null, row);
        }
        this.rowClick.emit(row);
    }

    getColumnCount() {
        let count = this.data.columns.length;

        if ((this.expansionField || this.expansionTemplate)) {
            count++;
        }

        if ((this.selectionScheme === 'single' || this.selectionScheme === 'multiple')) {
            count++;
        }

        return count;
    }

    getRowId(row: Object): string {
        if (this.rowKeyField) {
            return TableComponent.getValueFromObj(this.rowKeyField, row).toString();
        } else {
            return JSON.stringify(row);
        }
    }

    toggleRow(event: any, selected: boolean, index: number, row: Object) {
        const key = this.getRowId(row);

        if (selected) {
            this.selectionMap[key] = row;
        } else {
            delete this.selectionMap[key];
        }

        const selectionMap = this.selectionMap;
        this.selectionChanged.emit(Object.keys(selectionMap).map(function (itm) { return selectionMap[itm]; }));

        if (event) {
            event.stopPropagation();
        }
    }

    selectRow(event: any, row: Object) {
        this.selectionMap['selected'] = row;
        this.selectionChanged.emit(row);
        if (event) {
            event.stopPropagation();
        }
    }

    isSelected(row: Object): boolean {
        return this.selectionMap['selected'] === row || this.selectionMap[this.getRowId(row)] != null;
    }

    indexSelected(): string {
        if (this.selectionMap['selected'] == null) {
            return '-1';
        }
        return '' + this.data.page.indexOf(this.selectionMap['selected']);
    }

    selectAll(selected: boolean) {
        if (selected) {
            for (const row of this.data.page) {
                const key = this.getRowId(row);
                this.selectionMap[key] = row;
            }
        } else {
            for (const row of this.data.page) {
                const key = this.getRowId(row);
                delete this.selectionMap[key];
            }
        }

        const selectionMap = this.selectionMap;
        this.selectionChanged.emit(Object.keys(selectionMap).map(function (itm) { return selectionMap[itm]; }));

        if (event) {
            event.stopPropagation();
        }
    }

    // clears row selection, filters and sort. If selectionMap is not cleared, when swapping data,  old selction map will get applied to new data.
    clearData() {
        this.filterMap = {};
        this.sortMap = {};
        this.selectionMap = {};
        this.sorts = [];
        this.globalFilterStr = null;
        this.expandedRow = null;
        this.toggleAllState = false;
    }

    exportCSVFile(data: any) {
        const csvContentBuffer = [];
        const headerRow = [];
        let contentRow = [];
        const d = new Date();
        const fileName = 'CSV_EXPORT_' + d.toISOString() + '.csv';
        const separator = ',';
        const endRow = '\n';
        const quotesRegex = /["]/g;

        if (data.columns) {
            data.columns.forEach(function (col) {
                if (col.cellField != null && col.cellField !== undefined) {
                    headerRow.push(`"${col.header}"`);
                }
            });
        }

        csvContentBuffer.push(headerRow.join(separator));

        if (data.content) {
            data.content.forEach(function (row) {
                contentRow = [];

                data.columns.forEach(function (col) {
                    if (col.cellField != null && col.cellField !== undefined) {
                        let cell = TableComponent.getValueFromObj(col.cellField, row);

                        if (typeof cell === 'object') {
                            cell = `"${JSON.stringify(cell).replace(quotesRegex, '""')}"`;
                        } else if (typeof cell === 'string') {
                            cell = `"${cell.replace(quotesRegex, '""')}"`;
                        }

                        contentRow.push(cell);
                    }
                });

                csvContentBuffer.push(contentRow.join(separator));
            });
        }

        this.generateCSVFile(`\ufeff${csvContentBuffer.join(endRow)}`, fileName);
    }

    generateCSVFile(csvContent: string, fileName: string) {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

        const link = document.createElement('a');
        if (link.download !== undefined) {
            // Browsers that support HTML5 download attribute
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', fileName);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

export interface DataSource {
    columns: Column[];
    page: any[];
    totalSize: number;
    loading: boolean;

    loadPage(offset: number, pageSize: number, globalFilter?: string, expansionField?: string, filters?: Filter[], sorts?: Sort[]);
}

export interface Filter {
    field: string;
    value: string;
}

export interface Sort {
    field: string;
    direction: Direction;
}

export class StaticDataSource implements DataSource {
    totalSize: number;
    page: any[];
    loading = false;

    constructor(public columns: Column[], public content: any[]) {
        this.totalSize = content.length;
    }

    loadPage(offset: number,
        pageSize: number,
        globalFilter: string = null,
        expansionField?: string,
        filters: Filter[] = [],
        sorts: Sort[] = []) {
        let filteredContent = this.content;

        for (const filter of filters) {
            filteredContent = this.applyFilter(filteredContent, filter);
        }

        if (globalFilter != null && globalFilter !== '') {
            filteredContent = this.applyGlobalFilter(filteredContent, globalFilter, expansionField);
        }

        this.applySorts(filteredContent, sorts);

        this.totalSize = filteredContent.length;

        if (!filteredContent || filteredContent.length < (offset + 1)) {
            this.page = [];
        } else if (filteredContent.length < (offset + pageSize)) {
            pageSize = filteredContent.length - offset;
        }

        this.page = filteredContent.slice(offset, offset + pageSize);
    }

    applyFilter(toFilter: any[], filter: Filter): any[] {
        const newContent = [];

        for (const row of toFilter) {
            const val = TableComponent.getValueFromObj(filter.field, row).toString();
            if (val.toLowerCase().indexOf(filter.value.toLowerCase()) >= 0) {
                newContent.push(row);
            }
        }

        return newContent;
    }

    applyGlobalFilter(toFilter: any[], filter: string, expansionField): any[] {
        const newContent = [];

        for (const row of toFilter) {

            // check the expansion field if there is one
            if (expansionField) {
                const val = TableComponent.getValueFromObj(expansionField, row).toString();
                if (val.toString().toLowerCase().indexOf(filter.toLowerCase()) >= 0) {
                    newContent.push(row);
                    continue;
                }
            }

            // check each column
            for (const col of this.columns) {
                const val = TableComponent.getValueFromObj(col.cellField, row).toString();
                if (val.toString().toLowerCase().indexOf(filter.toLowerCase()) >= 0) {
                    newContent.push(row);
                    break;
                }
            }
        }

        return newContent;
    }

    applySorts(data: any[], sorts: Sort[]) {
        if (!sorts || !data || sorts.length === 0) {
            return;
        }

        const recSort = function (leftSide, rightSide, sortIndex: number = 0): number {
            const sort = sorts[sortIndex];
            const leftVal = TableComponent.getValueFromObj(sort.field, leftSide);
            const rightVal = TableComponent.getValueFromObj(sort.field, rightSide);
            let multiplier = 1;

            if (sort.direction === Direction.DESCENDING) {
                multiplier = -1;
            }

            if (leftVal > rightVal) {
                return 1 * multiplier;
            } else if (leftVal < rightVal) {
                return -1 * multiplier;
            } else {
                if (sortIndex === sorts.length - 1) {
                    return 0;
                } else {
                    return recSort(leftSide, rightSide, sortIndex + 1);
                }
            }
        };

        data.sort((leftSide, rightSide): number => {
            return recSort(leftSide, rightSide);
        });
    }
}

export class PipeConfig {
    pipe: Pipe;
    args?: any[];
}

export class Column {
    disableSort?= false;
    disableFilter?= false;
    hidden?= false;
    header: string;
    cellField: string;
    headerTemplate?: TemplateRef<any>;
    cellTemplate?: TemplateRef<any>;
    templateParams?: any;
    cellPipes?: PipeConfig[];
}

export enum Direction {
    ASCENDING = 'ASCENDING',
    DESCENDING = 'DESCENDING'
}

@Pipe({
    name: 'multiPipe'
})
export class MutliPipe implements PipeTransform {

    public constructor(private injector: Injector) {
    }

    transform(value: any, pipeConfigs: any[]): any {
        if (Array.isArray(pipeConfigs) && pipeConfigs.length > 0) {
            for (const pipeConfig of pipeConfigs) {
                const pipe = this.injector.get(pipeConfig.pipe);
                let params = [value];
                if (pipeConfig.args && pipeConfig.args.length > 0) {
                    params = params.concat(pipeConfig.args);
                }
                try {
                    value = pipe.transform.apply(pipe, params);
                } catch (e) {
                    // eat exception and let value pass through
                }
            }
        }
        return value;
    }
}

