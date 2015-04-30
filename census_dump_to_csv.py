import csv

def main():
    with open('census_arr_dump.txt') as f:
        with open('census_arr_dump_spread.csv', 'w') as w:
            spreadsheet = csv.writer(w)
            for census_tract in f:
                spreadsheet.writerow([census_tract.strip()])

if __name__ == '__main__': main()