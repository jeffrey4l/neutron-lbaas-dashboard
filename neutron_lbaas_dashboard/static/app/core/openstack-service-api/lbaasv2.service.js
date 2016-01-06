/*
 * Copyright 2015 IBM Corp.
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
(function () {
  'use strict';

  angular
    .module('horizon.app.core.openstack-service-api')
    .factory('horizon.app.core.openstack-service-api.lbaasv2', lbaasv2API);

  lbaasv2API.$inject = [
    'horizon.framework.util.http.service',
    'horizon.framework.widgets.toast.service'
  ];

  /**
   * @ngdoc service
   * @name horizon.app.core.openstack-service-api.loadbalancers
   * @description Provides direct pass through to neutron LBaaS v2 with NO abstraction.
   * @param apiService The horizon core API service.
   * @param toastService The horizon toast service.
   * @returns The LBaaS V2 service API.
   */

  function lbaasv2API(apiService, toastService) {
    var service = {
      getLoadBalancers: getLoadBalancers,
      getLoadBalancer: getLoadBalancer,
      createLoadBalancer: createLoadBalancer,
      editLoadBalancer: editLoadBalancer,
      getListeners: getListeners,
      getListener: getListener,
      getPool: getPool,
      getMembers: getMembers,
      getMember: getMember,
      getHealthMonitor: getHealthMonitor
    };

    return service;

    ///////////////

    // Load Balancers

    /**
     * @name horizon.app.core.openstack-service-api.lbaasv2.getLoadBalancers
     * @description
     * Get a list of load balancers.
     *
     * The listing result is an object with property "items". Each item is
     * a load balancer.
     */

    function getLoadBalancers() {
      return apiService.get('/api/lbaas/loadbalancers/')
        .error(function () {
          toastService.add('error', gettext('Unable to retrieve load balancers.'));
        });
    }

    /**
     * @name horizon.app.core.openstack-service-api.lbaasv2.getLoadBalancer
     * @description
     * Get a single load balancer by ID
     * @param {string} id
     * Specifies the id of the load balancer to request.
     */

    function getLoadBalancer(id) {
      return apiService.get('/api/lbaas/loadbalancers/' + id)
        .error(function () {
          toastService.add('error', gettext('Unable to retrieve load balancer.'));
        });
    }

    /**
     * @name horizon.app.core.openstack-service-api.lbaasv2.createLoadBalancer
     * @description
     * Create a new load balancer
     * @param {object} spec
     * Specifies the data used to create the new load balancer.
     */

    function createLoadBalancer(spec) {
      return apiService.post('/api/lbaas/loadbalancers/', spec)
        .error(function () {
          toastService.add('error', gettext('Unable to create load balancer.'));
        });
    }

    /**
     * @name horizon.app.core.openstack-service-api.lbaasv2.editLoadBalancer
     * @description
     * Edit a load balancer
     * @param {string} id
     * @param {object} spec
     * Specifies the data used to update the load balancer.
     */

    function editLoadBalancer(id, spec) {
      return apiService.put('/api/lbaas/loadbalancers/' + id + '/', spec)
        .error(function () {
          toastService.add('error', gettext('Unable to update load balancer.'));
        });
    }

    // Listeners

    /**
     * @name horizon.app.core.openstack-service-api.lbaasv2.getListeners
     * @description
     * Get the list of listeners.
     * If a loadbalancer ID is passed as a parameter, the returning list of
     * listeners will be filtered to include only those listeners under the
     * specified loadbalancer.
     * @param {string} id
     * Specifies the id of the loadbalancer to request listeners for.
     *
     * The listing result is an object with property "items". Each item is
     * a listener.
     */

    function getListeners(id) {
      var params = id ? {'params': {'loadbalancerId': id}} : {};
      return apiService.get('/api/lbaas/listeners/', params)
        .error(function () {
          toastService.add('error', gettext('Unable to retrieve listeners.'));
        });
    }

    /**
     * @name horizon.app.core.openstack-service-api.lbaasv2.getListener
     * @description
     * Get a single listener by ID.
     * @param {string} id
     * Specifies the id of the listener to request.
     */

    function getListener(id) {
      return apiService.get('/api/lbaas/listeners/' + id)
        .error(function () {
          toastService.add('error', gettext('Unable to retrieve listener.'));
        });
    }

    // Pools

    /**
     * @name horizon.app.core.openstack-service-api.lbaasv2.getPool
     * @description
     * Get a single Pool by ID.
     * @param {string} id
     * Specifies the id of the pool to request.
     */

    function getPool(id) {
      return apiService.get('/api/lbaas/pools/' + id)
        .error(function () {
          toastService.add('error', gettext('Unable to retrieve pool.'));
        });
    }

    // Members

    /**
     * @name horizon.app.core.openstack-service-api.lbaasv2.getMembers
     * @description
     * Get a list of members.
     * @param {string} poolId
     * Specifies the id of the pool the members belong to.
     *
     * The listing result is an object with property "items". Each item is
     * a member.
     */

    function getMembers(poolId) {
      return apiService.get('/api/lbaas/pools/' + poolId + '/members/')
        .error(function () {
          toastService.add('error', gettext('Unable to retrieve members.'));
        });
    }

    /**
     * @name horizon.app.core.openstack-service-api.lbaasv2.getMember
     * @description
     * Get a single pool Member by ID.
     * @param {string} poolId
     * Specifies the id of the pool the member belongs to.
     * @param {string} memberId
     * Specifies the id of the member to request.
     */

    function getMember(poolId, memberId) {
      return apiService.get('/api/lbaas/pools/' + poolId + '/members/' + memberId)
        .error(function () {
          toastService.add('error', gettext('Unable to retrieve member.'));
        });
    }

    /**
     * @name horizon.app.core.openstack-service-api.lbaasv2.getHealthMonitor
     * @description
     * Get a single pool health monitor by ID.
     * @param {string} monitorId
     * Specifies the id of the health monitor.
     */

    function getHealthMonitor(monitorId) {
      return apiService.get('/api/lbaas/healthmonitors/' + monitorId)
        .error(function () {
          toastService.add('error', gettext('Unable to retrieve health monitor.'));
        });
    }

  }
}());
