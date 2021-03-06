/*
	***** BEGIN LICENSE BLOCK *****
	
	Copyright © 2017 Center for History and New Media
					George Mason University, Fairfax, Virginia, USA
					http://zotero.org
	
	This file is part of Zotero.
	
	Zotero is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
	
	Zotero is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU Affero General Public License for more details.

	You should have received a copy of the GNU Affero General Public License
	along with Zotero.  If not, see <http://www.gnu.org/licenses/>.
	
	***** END LICENSE BLOCK *****
*/

describe('TestSetup', function() {
	function executorTests(executor) {
		it('executes code properly and returns the response', Promise.coroutine(function* () {
			assert.equal(yield executor(() => 2+2), 4);
		}));
		it('throws an error when the function code is invalid', Promise.coroutine(function* () {
			try {
				yield executor(() => notvalid)
			} catch (e) {
				return;
			}
			throw new Error('Error not thrown');
		}));
		it('throws an error when the passed function throws an error', Promise.coroutine(function * () {
			try {
				yield executor(function() {throw new Error('test')})
			} catch (e) {
				return;
			}
			throw new Error('Error not thrown');
		}));	
	}

	describe('#background()', function() {
		executorTests(background);
		it('can access background properties', Promise.coroutine(function * () {
			assert.isTrue(yield background(() => Zotero.isBackground));
		}));
	});
	
	describe('Tab', function() {
		var tab = new Tab();
		
		describe('#init()', function() {
			it('opens a new tab with the specified url', Promise.coroutine(function * () {
				let url = 'http://www.example.com/';
				yield tab.init(url);
				assert.isOk(tab.tabId);
				
				let tabUrl = yield new Promise(function(resolve) {
					chrome.tabs.get(tab.tabId, function(tab) {
						resolve(tab.url);
					});
				});
				assert.equal(tabUrl, url);
			}));
		});
		
		describe('#run()', function() {
			executorTests(tab.run.bind(tab));
			it('can access injected properties', Promise.coroutine(function * () {
				assert.isTrue(yield tab.run(() => Zotero.isInject));
			}));
		});
		
		describe('#close()', function() {
			it('closes the tab', Promise.coroutine(function* () {
				let tabId = tab.tabId;
				yield tab.close();
				let closedTab = yield new Promise((resolve) => chrome.tabs.get(tabId, resolve));
				assert.isNotOk(closedTab);
			}));
		})
	});
});