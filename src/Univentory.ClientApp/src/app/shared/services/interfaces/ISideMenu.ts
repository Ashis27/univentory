export interface ISideMenu {
    /**
     * Menu item unique id
     */
    Id?:number;
    /**
     * Navbar menu sort form name
     */
    SortName: string;
    /**
    * Navbar display menu  name
    */
    Name: String;
    /**
    * Navbar menu icon
    */
    Icon: string;
    /**
     * Navbar menu default status
     */
    IsDefault?: boolean;
    /**
     * Navbar menu redirection url
     */
    RedirectURL: string
}