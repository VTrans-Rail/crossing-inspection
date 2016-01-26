# Beta 1 - Initial Release 12/02/15

## Beta 2 - 12/09/15
  - Popup maximizes automatically in mobile device under 415 pixels wide. (#95 & #97)

  - Instructions Overlay added. (#110)

  - Replaced placeholder photos with actual crossing photos in the report page. (#111 & #113)

  - Added favicon to index.html and report.html (#115)
  - Full Report link in popup now opens a new tab. This allows you to maintain your current extent in the map (index.html page). It also allows you to open up multiple tabs for different crossing reports and compare. (#115)
  - Added links to popup attachments to view full image in a new tab. (#115)
  - Increased max search suggestions. (#115)
  - Signs show up at very high zoom (#115)

  - Fixed popup scrolling issue that occurred when using a touchscreen device. Previously you could not view any content in the popup that overflowed the popup container if you were using an iphone or other touchscreen devices. (#118)

  - Added mile post layers to map. (#119)
  - Basemap now changes from 'topo' to 'streets' when zoomed in past level of detail (LOD) 11. (#119)
  - BasemapToggle button added that allows you to toggle 'satellite' imagery basemap on/off when zoomed in past LOD 11. (#119 #123)

  - Added help button that displays an instructions page. (#120)
  - Improved styling of navbar to be more responsible. (#120)
  - Remove search dropdown list. (#120)

  - Changed popup style to better match the lighter look of the topo map and navbar. (#122)

  - Changed the AADT symbology to distinguish the traffic data from railroad lines. (#128)
  - Added layer toggle option. Radio buttons provide the ability to toggle on/off AADT and Signs layers. (#128)

  - Created a LocateButton to locate and zoom to the users location. (#129)

  - Added warning text that explains when information and images don't load correctly in a popup. (#133)
  - Styled popup links to Full Report page and view full images. (#133)
  - Enabled Full Report link on signs popup to navigate to the crossing report related to the sign. (#133)


## Beta 3 - Released 12/17/2015
- Removed AADT Layer (#150, #126, #135)
- Removed Restore Button on popup when screen is less than 415 pixels wide. Also styled prev, next, close, and popup title for aesthetics and ease of use on a touchscreen (#149)
- Added the text "Help" under the symbol for the Help Button to make it more clear to users. Also made styling more responsive for Help Button (#148, #169, #157, #168)
- Added responsive Legend for desktop and mobile (#147, #146)
- Fixed bug for instructions page so that it loads correctly on iphone 4/5 (#145)
- Improved "Oops" text for popup so that it is more clear and concise (#161)
- Removed LayerToggle and BasemapToggle. Changed high-zoom basemap from streets to satellite imagery with world transportation reference layer for labels. (#131, #121, #162)
- Removed Rail Trails and Twin State RR from Railroad Lines layer as they are not associated with any public crossings. (#156)
- Changed JS code for loading popup info and images so that each popup loads the correct photos. Stopped photos from automatically loading in popup and added button to popup to load photos on request. Rotated sign photos 90 degrees so that the majority of the sign photos display with the correct orientation in popups. Previously photos were loading for the wrong crossing when network was slow. (#160, #98, #174)
- Added DOT Number label to crossings and fixed font issue for labels in different browsers (#140, #158)

## Beta 4 - Released 1/6/2016
- Add field metadata explanation to Report Page when hovering over field, or tapping on a touchscreen (#69)
- Rotate Sign images to display upright & ignore rotation on iphone as the phone automatically adjusts orientation (#181, #182)
- Tested load times for hosted vs nonhosted feature services. Chose to move ahead with our *ArcGIS Server* feature services instead of hosting. If slow, will switch back to hosted later (#185)
- Replace domain code or field code with domain alias/value for popups and report page. Fields changed are `WDCode` & `SurfaceType2` (#187, #52, #175)
- Images displayed on the report page double as links to open the full image in a new tab. They blur on *hover* and display "View Full Image" text. (#184)
- **New Report Page Layout!!!** (#100) Used *Gridforms*
- New report page layout javascript file was run through *Babel* in order to be compatible with *Internet Explorer*. (#186)
- Crossing symbology for the map page is now colorblind-safe (#139)

## Beta 5 - Released 1/26/2016
- Serve **thumbnail images** instead of full images on map page popup and in the report page. Only serves full image if someone clicks on full image link. This *drastically* reduces page load time. Also organized how thumbnails were stored (#213, #209, #216, #207, #206, #214, #215, #220, #233, #232)
- Wrote *IE conditional statements* to serve a separate javascript file when browser was **IE9** and issue browser alert for IE9 and lower. Also send alert in Safari and Opera (#233, #232, #202)
- Fixed **search widget suggestions**. When we switched to using ArcGIS for Server Feature classes (local) we discovered that the search suggestions were no longer working because our server does not support *pagination*. Now use combination of local and hosted feature services for the Web App. Also had to remove *domains* from the trimmed down hosted feature service to allow suggestions to work without an *exact match*. (#208, #228, #212)
- Add responsive placeholder text to search widget. (#114)
- Increase length of search suggestions menu (#116)
- Added search suggestions summarization bar at top of suggestions menu.
- Added test to determine if javascript is enabled and changes html content to display warning if javascript is disabled. This application is useless without javascript (#218)
- Made Town name display in *title case* instead of upper case on report page. (#191)
- Metadata now stays collapsed if you are using a mouse on a medium width device or viewport. Previously, a mouseover event would cause the bottom metadata banner to reappear on medium devices. Also removed the gab below the Metadata section on medium devices (#195, #194)
- On the **Report Page** the *Distance to Intersection* now displays as "N/A" when value equals null. (#193)
- Added basemap credits back to map page (esriControlsBR) and positioned them to be responsive (#226, #222)
- Limited Esri Geocoder *extent* to region around Vermont for Search Widget (#217, #229)
- Fixed styling of *Contact Us* section to match that of the *Metadata* section (#224)
- Updated the crossing icon that is located on the *Help* instructions page to match the new colorblind-safe symbology. (#198)
- Updated the *Crossing Condition* color that displays on the *Report Page* to match the new colorblind-safe symbology. (#196)
- Fixed bug with *Metadata* section that prevented proper scrolling when there was overflow-y. (#223)
- Fixed a popup bug (#211)
- Removed *Maximize* button from popup and spread out popup title bar buttons to make it easier on touchscreen devices. Now that thumbnail images are served in popups instead of the full size images, there is no benefit to maximizing the popup. (#210)
- Cleared out old test files (#234)
- Removed browser specific styling that sometimes caused *disabled* `input` fields to display in a very light color that was difficult to read. If we used *readonly* instead of *disabled* it created issues with the `onclick()` functions. (#192)
- Created Report Page styling specific for *Print* functions. Also added a clear print `button` to make it easier for users. (#230)
- **Fixed major report page bug for Firefox.** This bug prevented `fuctions` created within a conditional block from being read properly. (#237)
- Added **Events** for **Google Analytics**. (#153)
