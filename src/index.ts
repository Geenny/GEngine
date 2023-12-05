import Entry from "./entry/Entry";
import { moduleList } from "./entry/EntryModules";

const entry = new Entry( moduleList );
entry.start();