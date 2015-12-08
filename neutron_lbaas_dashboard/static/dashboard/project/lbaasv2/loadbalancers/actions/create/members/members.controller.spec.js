/*
 * Copyright 2016 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function() {
  'use strict';

  describe('Create Load Balancer Add Members Step', function() {
    var members = [{
      id: '1',
      name: 'foo',
      description: 'bar',
      weight: 1,
      port: 80,
      address: { ip: '1.2.3.4', subnet: '1' },
      addresses: [{ ip: '1.2.3.4', subnet: '1' },
                  { ip: '2.3.4.5', subnet: '2' }]
    }];

    beforeEach(module('horizon.framework.util.i18n'));
    beforeEach(module('horizon.dashboard.project.lbaasv2'));

    describe('AddMembersController', function() {
      var ctrl, scope;

      beforeEach(inject(function($controller) {
        scope = {
          model: {
            spec: {
              members: []
            },
            members: members
          }
        };
        ctrl = $controller('AddMembersController', { $scope: scope });
      }));

      it('should define error messages for invalid fields', function() {
        expect(ctrl.portError).toBeDefined();
        expect(ctrl.weightError).toBeDefined();
      });

      it('should define transfer table properties', function() {
        expect(ctrl.tableData).toBeDefined();
        expect(ctrl.tableLimits).toBeDefined();
        expect(ctrl.tableHelp).toBeDefined();
      });

      it('should have available members', function() {
        expect(ctrl.tableData.available).toBeDefined();
        expect(ctrl.tableData.available.length).toBe(1);
        expect(ctrl.tableData.available[0].id).toBe('1');
      });

      it('should not have allocated members', function() {
        expect(ctrl.tableData.allocated).toEqual([]);
      });

      it('should allow adding multiple members', function() {
        expect(ctrl.tableLimits.maxAllocation).toBe(-1);
      });

      it('should properly format address popover target', function() {
        var target = ctrl.addressPopoverTarget(members[0]);
        expect(target).toBe('1.2.3.4...');
      });
    });

    describe('Add Members Template', function() {
      var $scope, $element, popoverContent;

      beforeEach(module('templates'));
      beforeEach(module('horizon.dashboard.project.lbaasv2'));

      beforeEach(inject(function($injector) {
        var $compile = $injector.get('$compile');
        var $templateCache = $injector.get('$templateCache');
        var basePath = $injector.get('horizon.dashboard.project.lbaasv2.basePath');
        var popoverTemplates = $injector.get('horizon.dashboard.project.lbaasv2.popovers');
        var markup = $templateCache.get(
          basePath + 'loadbalancers/actions/create/members/members.html');
        $scope = $injector.get('$rootScope').$new();
        $scope.model = {
          spec: {
            members: []
          },
          members: members
        };
        $element = $compile(markup)($scope);
        var popoverScope = $injector.get('$rootScope').$new();
        popoverScope.member = members[0];
        popoverContent = $compile(popoverTemplates.ipAddresses)(popoverScope);
      }));

      it('should show IP addresses popover on hover', function() {
        var ctrl = $element.scope().ctrl;
        ctrl.tableData.displayedAvailable = members;
        $scope.$apply();

        var popoverElement = $element.find('span.addresses-popover');
        expect(popoverElement.length).toBe(1);

        $.fn.popover = angular.noop;
        spyOn($.fn, 'popover');
        spyOn(ctrl, 'showAddressPopover').and.callThrough();
        popoverElement.trigger('mouseover');

        expect(ctrl.showAddressPopover).toHaveBeenCalledWith(
          jasmine.objectContaining({type: 'mouseover'}), members[0]);
        expect($.fn.popover.calls.count()).toBe(2);
        expect($.fn.popover.calls.argsFor(0)[0]).toEqual({
          content: popoverContent,
          html: true,
          placement: 'top',
          title: 'IP Addresses (2)'
        });
        expect($.fn.popover.calls.argsFor(1)[0]).toBe('show');

        spyOn(ctrl, 'hideAddressPopover').and.callThrough();
        popoverElement.trigger('mouseleave');

        expect(ctrl.hideAddressPopover)
          .toHaveBeenCalledWith(jasmine.objectContaining({type: 'mouseleave'}));
        expect($.fn.popover.calls.count()).toBe(3);
        expect($.fn.popover.calls.argsFor(2)[0]).toBe('hide');
      });
    });

  });
})();
