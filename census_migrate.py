# Purpose of this script is to eliminate districts in statewide_census_tracts.geojson
# that are not in our census data. It should only need to be run once to produce
# a usable static file for loading, but I am documenting in case of bugs

import json

def main():
    with open('census_arr_dump.txt') as f:
        censuses = set([float(x) for x in f.read().split('\n')])
    with open('js/statewide_census_tracts.geojson') as f:
        geojson = json.load(f)
        features = geojson['features']

        i = 0
        while i < len(features):
            feature = features[i]
            if not float(feature['properties']['NAME']) in censuses:
                del features[i]
            else:
                i += 1

        with open('js/apd_census_tracts.geojson', 'w') as f1:
            json.dump(geojson, f1, separators=(',',':'))

if __name__ == '__main__': main()