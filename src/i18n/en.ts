// src/i18n/en.ts
export const en = {
  "app.name": "FOODOO",
  "app.skip": "Skip to content",
  "app.loading": "Loading…",
  "app.offlineReady": "Ready to work offline.",
  "app.valueLine":
    "Daily portion planning that counts the customers a sold-out menu hides.",

  "nav.main": "Main navigation",
  "nav.today": "Today",
  "nav.plan": "Plan",
  "nav.service": "Service",
  "nav.close": "Close",
  "nav.settings": "Settings",

  "header.demo": "Demo data",
  "header.offline": "Offline. Saved on this device.",

  "common.save": "Save",
  "common.cancel": "Cancel",
  "common.back": "Back",
  "common.next": "Next",
  "common.edit": "Edit",
  "common.archive": "Archive",
  "common.restore": "Restore",
  "common.closeDialog": "Close dialog",
  "common.yes": "Yes",
  "common.no": "No",
  "common.saveFailed": "Could not save. Please try again.",

  "lang.label": "Language",
  "lang.en": "English",
  "lang.id": "Bahasa Indonesia",

  "welcome.start": "Start setup",
  "welcome.continue": "Continue setup",
  "welcome.demo": "Try demo stall",
  "welcome.demoNote":
    "The demo stall uses made-up data so you can look around first.",
  "welcome.demoBlocked":
    "You have started your own setup. Delete it in Settings to try the demo.",

  "setup.step": "Step {step} of {total}",
  "setup.menus.title": "Your menus",
  "setup.menus.intro":
    "Add each dish you cook in the morning. You can change them later in Settings.",
  "setup.menus.needOne": "Add at least one menu to continue.",
  "setup.hours.title": "Opening hours",
  "setup.hours.intro": "When do you open and close, and which hours are busy?",
  "setup.done": "Setup complete. You are ready to plan.",
  "setup.hours.finish": "Finish setup",

  "menu.list.empty": "No menus yet. Add your first menu.",
  "menu.list.add": "Add menu",
  "menu.list.archived": "Archived menus ({count})",
  "menu.list.summary": "{price} · cost {cost} · usual {qty} portions",
  "menu.list.editLabel": "Edit {name}",
  "menu.list.archiveLabel": "Archive {name}",
  "menu.list.restoreLabel": "Restore {name}",
  "menu.editor.addTitle": "Add menu",
  "menu.editor.editTitle": "Edit menu",
  "menu.field.name": "Menu name",
  "menu.field.price": "Selling price (Rp)",
  "menu.field.cost": "Cost per portion (Rp)",
  "menu.field.salvage": "Value of a leftover portion (Rp)",
  "menu.field.salvageHint":
    "What an unsold portion is still worth to you, for example as a staff meal. Usually 0.",
  "menu.field.usualQty": "Usual portions per day",
  "menu.error.nameLength": "Enter a name of 1 to 40 characters",
  "menu.error.priceInvalid": "Enter a price in whole rupiah, above 0",
  "menu.error.costInvalid": "Enter a cost in whole rupiah, 0 or more",
  "menu.error.costNotBelowPrice": "Cost must be lower than price",
  "menu.error.salvageInvalid": "Enter a value in whole rupiah, 0 or more",
  "menu.error.salvageNotBelowPrice": "Leftover value must be lower than price",
  "menu.error.usualInvalid": "Enter a whole number from 1 to 999",
  "menu.saved": "Menu saved",
  "menu.archivedToast": "Menu archived",
  "menu.restoredToast": "Menu restored",

  "hours.open": "Opening time",
  "hours.close": "Closing time",
  "hours.error.timeInvalid": "Enter a time as HH:MM",
  "hours.error.closeSameAsOpen":
    "Closing time must be different from opening time",
  "hours.overnight":
    "You close after midnight. Sales after midnight count for the day you opened.",
  "hours.busyTitle": "Busy hours",
  "hours.busyHint":
    "Tap an hour to change it: quiet, normal, busy. Busier hours mean more customers arrive then.",
  "hours.busyEmpty": "Set valid opening hours to see the busy hours.",
  "hours.level.1": "Quiet",
  "hours.level.2": "Normal",
  "hours.level.4": "Busy",
  "hours.saved": "Hours saved",

  "today.title": "Today",
  "today.loopTitle": "Today's loop",
  "today.phase.plan": "Plan",
  "today.phase.service": "Service",
  "today.phase.close": "Close",
  "today.status.done": "Done",
  "today.status.current": "Now",
  "today.status.next": "Next",
  "today.action.plan": "Plan today's portions",
  "today.action.service": "Open service",
  "today.action.close": "Close the day",
  "today.action.done": "See you tomorrow",
  "today.doneNote": "Today is closed. Come back tomorrow morning to plan.",
  "today.counts.title": "Today so far",
  "today.counts.portions": "Portions planned",
  "today.counts.soldOut": "Menus sold out",
  "today.counts.closed": "Day closed",
  "today.empty.setupTitle": "Finish setting up",
  "today.empty.setupBody":
    "Add your menus and opening hours to get daily suggestions.",
  "today.empty.setupAction": "Continue setup",
  "today.empty.menusTitle": "No active menus",
  "today.empty.menusBody":
    "All menus are archived. Add or restore a menu in Settings.",
  "today.empty.menusAction": "Open Settings",
  "today.incompleteTitle": "Days not closed",
  "today.incompleteBody":
    "These days were never closed, so they are not used for suggestions yet. Close them to count them:",
  "today.incompleteAction": "Close {date}",

  "plan.title": "Plan",
  "plan.intro": "Suggested portions for today. Change any number, then save.",
  "plan.suggested": "Suggested {qty}",
  "plan.edited": "Edited",
  "plan.portionsLabel": "Portions of {name}",
  "plan.decrease": "One less {name}",
  "plan.increase": "One more {name}",
  "plan.total": "Total {qty} portions",
  "plan.acceptAll": "Accept all",
  "plan.save": "Save plan",
  "plan.saved": "Plan saved",
  "plan.savedNote":
    "Plan saved. You can still change it until the first menu sells out.",
  "plan.locked":
    "The plan is locked because a menu has sold out today. Undo the sell-out to change it.",
  "plan.closedNote": "Today is closed. This was the plan.",
  "plan.cooked": "Cooked {qty}",

  "service.title": "Service",
  "service.intro": "Tap a menu the moment it sells out.",
  "service.cooked": "Cooked {qty}",
  "service.tapHint": "Tap when sold out",
  "service.soldOutAt": "Sold out {time}",
  "service.holdHint": "Hold the tile or press Edit time to change the time.",
  "service.earlyTitle": "{name} sold out already?",
  "service.earlyBody":
    "It is {time} and you opened at {open}. A sell-out this early makes FOODOO estimate very high demand. Mark it only if it really sold out.",
  "service.earlyConfirm": "Yes, it sold out",
  "service.editTime": "Edit time",
  "service.editTimeLabel": "Edit the sold-out time of {name}",
  "service.soldOutToast": "{name} sold out at {time}",
  "service.undo": "Undo",
  "service.undone": "Sell-out undone",
  "service.timeSaved": "Sold-out time saved",
  "service.cleared": "Marked as not sold out",
  "service.notPlannedTitle": "Plan today first",
  "service.notPlannedBody": "Service starts once today's portions are saved.",
  "service.planAction": "Plan today's portions",
  "service.closedNote": "Today is closed. Sell-outs can no longer be changed.",

  "soldOut.sheetTitle": "Sold-out time: {name}",
  "soldOut.timeLabel": "Time it sold out",
  "soldOut.clear": "Not sold out",
  "soldOut.error.timeInvalid": "Enter a time as HH:MM",
  "soldOut.error.outsideHours": "Enter a time between {open} and {close}",

  "close.title": "Close",
  "close.intro": "Count what is left of each menu.",
  "close.leftoverPlaceholder": "?",
  "close.leftoverMissing": "Enter the leftover portions, or 0 if none are left",
  "close.leftoverMissingSummary":
    "Enter the leftover portions for {count} menu(s) before closing.",
  "close.pastIntro": "You are closing a past day: {date}.",
  "close.pastSheetTitle": "Close {date}?",
  "close.pastClosed": "{date} closed",
  "close.soldOutChip": "Sold out {time}",
  "close.leftoverLabel": "Leftover portions of {name}",
  "close.cookedOf": "Cooked {qty}",
  "close.missedQuestion": "About what time did {name} run out?",
  "close.missedHint":
    "Nothing is left, but no sell-out was tapped. If you are not sure, keep the closing time.",
  "close.unusual": "Unusual day",
  "close.unusualHint":
    "Rain, a holiday or an event. The day is kept but not used for suggestions.",
  "close.closeDay": "Close day",
  "close.sheetTitle": "Close today?",
  "close.todayHeading": "How many wanted each menu today",
  "close.tomorrowNone": "No active menus. Add or restore a menu in Settings.",
  "close.tomorrowHeading": "Tomorrow's suggestions, {date}",
  "close.wanted": "Wanted",
  "close.suggestedPortions": "suggested portions",
  "close.confirm": "Confirm and close day",
  "close.closed": "Day closed",
  "close.closedTitle": "Today is closed",
  "close.unusualNote":
    "Marked as an unusual day: kept, but not used for suggestions.",
  "close.tomorrowNote":
    "Tomorrow morning the Plan screen starts from these numbers.",
  "close.notPlannedTitle": "Nothing to close yet",
  "close.notPlannedBody": "Plan today's portions first.",

  "estimate.value": "≈ {qty} (estimate)",
  "estimate.none": "Not recorded",

  "settings.title": "Settings",
  "settings.stall.title": "Stall",
  "settings.stall.name": "Stall name (optional)",
  "settings.stall.nameError": "Use at most 40 characters",
  "settings.stall.nameSaved": "Stall name saved",
  "settings.menus.title": "Menus",
  "settings.hours.title": "Hours and busy hours",
  "settings.hours.save": "Save hours",
  "settings.language.title": "Language",
  "settings.data.title": "Data",
  "settings.data.onDevice":
    "Everything is stored only on this device. Nothing is sent anywhere.",
  "settings.data.loadDemo": "Load demo stall",
  "settings.data.resetDemo": "Reset demo data",
  "settings.data.loadDemoBlocked":
    "Delete your own data first to load the demo stall.",
  "settings.data.demoLoaded": "Demo stall loaded",
  "settings.data.removeDemo": "Remove demo stall",
  "settings.data.deleteAll": "Delete all data",
  "settings.delete.title": "Delete all data?",
  "settings.delete.body":
    "This removes every menu, plan and record from this device. It cannot be undone.",
  "settings.delete.confirm": "Delete everything",
  "settings.removeDemo.title": "Remove the demo stall?",
  "settings.removeDemo.body":
    "This removes all demo data. You can then set up your own stall.",
  "settings.removeDemo.confirm": "Remove demo",
  "settings.about.title": "About",
  "settings.about.version": "Version {version}",
  "settings.about.body":
    "FOODOO suggests portions with fixed, explainable rules. It uses no AI model. The licences of the libraries and fonts, and the AI assistance used to build the app, are listed in the project README.",
  "settings.about.link": "Open the project README",

  "reason.history.soldOutWeekday":
    "Sold out on {soldOut} of the last {observations} {weekdayPlural} → {delta}",
  "reason.history.soldOutRecent":
    "Sold out on {soldOut} of the last {observations} days → {delta}",
  "reason.history.leftover":
    "Leftovers on {leftover} of the last {observations} days → {delta}",
  "reason.history.base": "Based on the last {observations} days",
  "reason.coldStart":
    "Not enough history yet. Starting from your usual {usualQty}",
  "reason.coldStartUp":
    "Not enough history yet. Starting from your usual {usualQty}, sold out last time",
  "reason.coldStartDown":
    "Not enough history yet. Starting from your usual {usualQty}, leftovers last time",

  "weekday.plural.0": "Sundays",
  "weekday.plural.1": "Mondays",
  "weekday.plural.2": "Tuesdays",
  "weekday.plural.3": "Wednesdays",
  "weekday.plural.4": "Thursdays",
  "weekday.plural.5": "Fridays",
  "weekday.plural.6": "Saturdays",
  "how.title": "How FOODOO calculates",
  "how.intro":
    "FOODOO uses a few fixed rules. This page shows them on an example, worked out by the same code the app uses for your stall.",
  "how.exampleNote":
    "Example stall. These numbers are an example, not your data.",
  "how.demandTitle": "1. How many people wanted a menu that sold out",
  "how.demandSetup":
    "Example: Nasi Uduk. {cooked} portions were cooked, and the last one was sold at {time}.",
  "how.barBefore": "(before {time})",
  "how.barsCaption":
    "Busy hours of the example stall. Filled bars are the hours before {time}.",
  "how.demandShare":
    "From the busy hours, about {percent}% of a normal day's customers had arrived by {time}.",
  "how.demandResult":
    "So {cooked} portions were enough for only about {percent}% of the day's customers. Over the whole day, about this many people would have wanted it:",
  "how.ruleCounted":
    "If a menu did not sell out, nothing is guessed: wanted = cooked − leftover.",
  "how.ruleLate":
    "If it sold out at or very close to closing time, wanted = cooked.",
  "how.ruleCap":
    "The guess is never more than 3 times what was cooked ({cap} here).",
  "how.ruleBusy":
    "A busy hour counts 4 times, a normal hour 2 times and a quiet hour once. You set them in Settings.",
  "how.suggestTitle": "2. How tomorrow's portions are suggested",
  "how.suggestMoney":
    "Each extra portion sold earns {gain}. Each portion left over loses {loss}, what it cost to cook.",
  "how.suggestCover":
    "Here a leftover loses more than a sale earns, so FOODOO does not cook for the busiest day. It picks the amount that would have been enough on about {cover} of every 100 past days.",
  "how.suggestHistory":
    "On the last {count} {weekdays}, people wanted: {values}.",
  "how.suggested": "Suggested",
  "how.ruleEligible":
    "Only closed, normal days count. Unusual days and days not closed are left out.",
  "how.ruleWeekday":
    "It looks at the same weekday first (up to the last 8). With fewer than 5 of those, it uses the last 14 days.",
  "how.ruleColdStart":
    "With fewer than 5 days of history, it starts from your usual portions: 10% more after a sell-out, 10% less when more than a fifth was left over.",
  "how.ruleYouDecide":
    "A suggestion is only a starting point. You can change every number before cooking.",
  "how.notTitle": "What FOODOO does not do",
  "how.notAi":
    "It uses no AI model. Every number comes from the fixed rules on this page.",
  "how.notCloud": "It sends nothing anywhere. Your data stays on this device.",
  "how.back": "Back to the app",
  "close.howLink": "How is this worked out?",
  "settings.about.how": "How FOODOO calculates",
  "settings.data.storageKept":
    "Protected: the browser will not clear this data to free up space.",
  "settings.data.storageAtRisk":
    "Not protected yet: the browser may clear this data if the phone runs low on space.",
  "settings.data.storageUnknown":
    "This browser does not say whether it protects the data.",
  "settings.data.keep": "Keep my data",
  "settings.data.keepGranted": "The browser will keep your data",
  "settings.data.keepRefused":
    "The browser said no for now. Adding FOODOO to the home screen often helps.",
  "landing.pillOffline": "Works offline",
  "landing.pillNoAccount": "No account",
  "landing.pillLocal": "Data stays on your phone",
  "landing.problemTitle": "Every morning is a guess",
  "landing.problemWasteTitle": "Too much",
  "landing.problemWasteBody":
    "Unsold portions go to waste, and so does the money spent cooking them.",
  "landing.problemEarlyTitle": "Too little",
  "landing.problemEarlyBody":
    "A dish sells out before noon and later customers walk away.",
  "landing.problemHiddenTitle": "Sold out hides demand",
  "landing.problemHiddenBody":
    "Sales stop when the pot is empty, so your records never show how many people really wanted it.",
  "landing.loopTitle": "A daily loop that takes minutes",
  "landing.loopPlanTitle": "Plan in the morning",
  "landing.loopPlanBody":
    "See a suggested portion for each dish, then change any number you like.",
  "landing.loopServiceTitle": "Mark sold-out times",
  "landing.loopServiceBody": "Tap when a dish runs out. FOODOO keeps the time.",
  "landing.loopCloseTitle": "Close the day",
  "landing.loopCloseBody":
    "Enter what is left. FOODOO estimates how many people wanted each dish.",
  "landing.loopNextTitle": "Better tomorrow",
  "landing.loopNextBody":
    "Tomorrow's suggestion learns from today, including the customers you missed.",
  "landing.exampleBadge": "Example",
  "landing.whyTitle": "Why FOODOO is different",
  "landing.whyHiddenTitle": "Counts missed customers",
  "landing.whyHiddenBody":
    "It uses the sell-out time and your busy hours to estimate the demand a sold-out day hides.",
  "landing.whyRulesTitle": "Rules you can check",
  "landing.whyRulesBody":
    "No AI model. Every number comes from fixed rules you can read in the app.",
  "landing.whyOfflineTitle": "Built for the stall",
  "landing.whyOfflineBody":
    "Installs like an app and works with no signal, on an ordinary phone.",
  "landing.whyPrivateTitle": "Private by design",
  "landing.whyPrivateBody":
    "No login, no server, no customer data. Export or delete everything at any time.",
  "landing.closingTitle": "Ready to try it?",
  "landing.closingBody":
    "Start with the demo stall at the top of this page, or set up your own menus.",
  "landing.installHint":
    "Tip: use your browser's “Add to Home screen” to open FOODOO like an app.",
  "settings.about.landing": "About FOODOO",
  "landing.headline": "Cook the right amount.",
  "landing.headlineAccent": "No piles of leftovers, no turning customers away.",
  "landing.exampleTitle": "What you will see",
  "landing.exampleCooked": "Cooked",
  "landing.exampleSoldOut": "Sold out at",
} as const;
