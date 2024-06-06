export const regions : {
    [key: string]: {
        region_name: string;
        api: string;
        trailheads: {
            [key: string]: string;
        };
    };

}= {
    "445859": {
        "region_name": "Yosemite",
        "api": "permitinyo",
        "trailheads": {
            "44585901": "Alder Creek",
            "44585902": "Aspen Valley",
            "44585903": "Base Line Camp Road",
            "44585904": "Beehive Meadows",
            "44585905": "Bridevail Creek",
            "44585906": "Budd Creek (cross-country only)",
            "44585907": "Cathedral Lakes",
            "44585908": "Chilnualna Falls",
            "44585909": "Cottonwood Creek",
            "44585910": "Deer Camp",
            "44585911": "Gaylor Creek/Lake (cross-country only)",
            "44585912": "Glacier Point->Illilouette",
            "44585913": "Glacier Point->Little Yosemite Valley",
            "44585914": "Glen Aulin",
            "44585915": "Glen Aulin->Cold Canyon/Waterwheel (pass through)",
            "44585916": "Happy Isles->Illilouette (No Donohue Pass)",
            "44585917": "Happy Isles->Little Yosemite Valley (No Donohue Pass)",
            "44585918": "Happy Isles->Past LYV (Donohue Pass Eligible)",
            "44585919": "Luken->Lukens Lake",
            "44585920": "Lukens Lake->Yosemite Creek",
            "44585921": "Lyell (No Donohue Pass)",
            "44585922": "Lyell Canyon (Donohue Pass Eligible)",
            "44585923": "Mather Ranger Station",
            "44585924": "May Lake",
            "44585925": "May Lake->Snow Creek",
            "44585926": "McGurk Meadow",
            "44585927": "Miguel Meadow",
            "44585928": "Mirror Lake->Snow Creek",
            "44585929": "Mono Meadow",
            "44585930": "Mono/Parker Pass",
            "44585931": "Murphy Creek",
            "44585932": "Nelson Lake (cross-country only)",
            "44585933": "Old Big Oak Flat Road",
            "44585934": "Ostrander (Lost Bear Meadow)",
            "44585935": "Pohono Trail (Glacier Point)",
            "44585936": "Pohono Trail (Taft Point)",
            "44585937": "Pohono Trail (Wawona Tunnel/Bridalveil Parking)",
            "44585938": "Poopenaut Valley",
            "44585939": "Porcupine Creek",
            "44585940": "Rafferty Creek->Vogelsang",
            "44585941": "Rancheria Falls",
            "44585942": "Rockslides (cross-country only)",
            "44585943": "Smith Peak",
            "44585944": "South Fork of Tuolumne River",
            "44585945": "Sunrise (No Donohue Pass)",
            "44585946": "Tamarack Creek",
            "44585947": "Ten Lakes",
            "44585948": "Westfall Meadow",
            "44585949": "White Wolf Campground",
            "44585950": "White Wolf->Aspen Valley",
            "44585951": "White Wolf->Pate Valley",
            "44585952": "White Wolf->Smith Meadow (including Harden Lake)",
            "44585953": "Yosemite Creek",
            "44585954": "Yosemite Falls",
            "44585955": "Young Lakes via Dog Lake",
            "44585956": "Young Lakes via Glen Aulin Trail"
        }
    },
    
    "4675334": {
        "region_name": "Lassen",
        "api": "permititinerary",
        "trailheads": {

        }
    },
    
    "445860": {
        "region_name": "Mount Whitney",
        "api": "permitinyo",
        "trailheads": {

        }
    },
   
    "445858": {
        "region_name": "Sierra National Forest",
        "api": "permitinyo",
        "trailheads": {

        }
    },
    
}

export const flattenedRegion: {[key: string]: string} = Object.keys(regions).reduce((acc, region) => {

    Object.keys(regions[region].trailheads).forEach(trailhead => {
        acc[trailhead] = regions[region].trailheads[trailhead];
    })

    return acc;

}, {})