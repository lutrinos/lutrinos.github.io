+++
date = '2025-06-13T10:24:46+02:00'
draft = true
title = 'tables'
+++

# Tables

EasyDocs uses `marked-extended-tables` to support advanced table features.

### marked-extended-tables
Extends the standard [Github-Flavored tables](https://github.github.com/gfm/#tables-extension-) to support advanced features:

  - Column Spanning
  - Row Spanning
  - Multi-row headers

## Column Spanning
Easily denote cells that should span multiple columns by grouping multiple pipe `|` characters at the end of the cell:

```txt
| H1      | H2      | H3      |
|---------|---------|---------|
| This cell spans 3 columns |||
```
| H1      | H2      | H3      |
|---------|---------|---------|
| This cell spans 3 columns |||

## Row Spanning
Easily denote cells that should span across the previous row by inserting a caret `^` character immediately before the closing pipes:

```
| H1           | H2      |
|--------------|---------|
| This cell    | Cell A  |
| spans three ^| Cell B  |
| rows        ^| Cell C  |
```
| H1           | H2      |
|--------------|---------|
| This cell    | Cell A  |
| spans three ^| Cell B  |
| rows        ^| Cell C  |

Cell contents across rows will be concatenated together with a single whitespace character ` `. Note that cells can only span multiple rows if they have the same column span.

## Multi-row headers
Headers can now follow the same structure as cells, to include multiple rows, and also support row and column spans.

```
| This header spans two   || Header A |
| columns *and* two rows ^|| Header B |
|-------------|------------|----------|
| Cell A      | Cell B     | Cell C   |
```
| This header spans two   || Header A |
| columns *and* two rows ^|| Header B |
|-------------|------------|----------|
| Cell A      | Cell B     | Cell C   |