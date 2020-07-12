import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, NgZone, ChangeDetectionStrategy, Injector } from '@angular/core';
import { ISideMenu } from '../../shared/services/interfaces/ISideMenu';
import { AuthService } from '../../shared/authentication/auth.service';
import { IUser } from '../../shared/services/interfaces/IUser';
import * as $ from 'jquery';


/**
 * Side navbar component
 */
@Component({
    selector: 'app-sidenavbar-cmp',
    // changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'sidenav.component.html',
    styleUrls: ['./sidenav.component.css']
})

export class SidebarComponent implements OnInit {

    /**
     * Current user details
     */
    userDetails: any;

    /**
     * Side menu list
     */
    public menuItems: Array<ISideMenu>;

    /**
     * Value of the current toogle value
     */
    toogleCount: number = 0;
    /**
     * Current user information
     */
    currentUserInfo: IUser;


    adminMenu: Array<ISideMenu> = [
        { Id: 1, SortName: "Dashboard", Name: "Dashboard", Icon: "assets/images/menu/dashboard.svg", RedirectURL: "/service", IsDefault: true },
        { Id: 2, SortName: "Products", Name: "Products", Icon: "assets/images/menu/barcode.svg", RedirectURL: "/service/products", IsDefault: false },
        { Id: 3, SortName: "Sale", Name: "Sale", Icon: "assets/images/menu/sales.svg", RedirectURL: "/service/sell", IsDefault: false },
        { Id: 4, SortName: "Sale History", Name: "Sale History", Icon: "assets/images/menu/saleHistory.svg", RedirectURL: "/service/sell-history", IsDefault: false },
        { Id: 5, SortName: "Purchase", Name: "Purchase", Icon: "assets/images/menu/shop.svg", RedirectURL: "/service/purchase", IsDefault: false },
        { Id: 6, SortName: "Consumers", Name: "Consumers", Icon: "assets/images/menu/group.svg", RedirectURL: "/service/consumers", IsDefault: false },
        { Id: 7, SortName: "Vendors", Name: "Vendors", Icon: "assets/images/menu/vendors.svg", RedirectURL: "/service/vendors", IsDefault: false },
        { Id: 8, SortName: "Report", Name: "Report", Icon: "assets/images/menu/event.svg", RedirectURL: "/service/report", IsDefault: false },
    ];

    /**
     * @ignore
     */
    constructor(
        zone: NgZone,
        Injector: Injector,
        public router: Router,
        private authService: AuthService,
        private route:ActivatedRoute
    ) {
        this.getMenuByRole();
    }

    /**
     * Toogle side navbar modal
     * @example
     * sidebarCollapse()
     * @returns {void}
     */
    sidebarCollapse() {
        if (this.toogleCount % 2 === 0) {
            $('#sidebar').addClass('active');
            $('#sidebar').find('.sidebar-logo').addClass("display-none");
        }
        else {
            $('#sidebar').removeClass('active');
            $('#sidebar').find('.sidebar-logo').removeClass("display-none");
        }
        this.toogleCount++;
    }

    /**
    * Initial entry point
    * @example
     * ngOnInit()
    * @returns {void}
    */
    ngOnInit() {
        this.currentUserInfo = this.authService.userInfo() as IUser;
    }

    /**
     * To get active menu list based ob role
     * @example
     * getMenuByRole(NECAdmin)
     * @param {string} role role name
     * @returns {List} menu list; 
     */
    getMenuByRole() {
        this.menuItems = this.adminMenu;
    }

    /**
     * To redirect page based on selected menu item URL
     * @example
     * redirect("/dashboard")
     * @param {string} item menu item URL
     * @returns {void}
     */
    redirect(item) {
        this.menuItems.forEach(element => {
            element.IsDefault = false;
            if (element.Name == item.Name && element.Id === item.Id)
                element.IsDefault = true;
        })
        this.router.navigate([item.RedirectURL]);
    }

    saleProductItem(){
        this.router.navigate(['/service/sell']);
    }

    purchaseItem(){
        this.router.navigate(['/service/purchase']);
    }

    getUserProfile(){
        this.router.navigate(['/service/user-profile']);
    }

    /**
     * Logout 
     * @example
     * logout()
     * @returns {boolean}
     */
    logout() {
        this.authService.signout();
        window.location.href = "/";
    }
}

