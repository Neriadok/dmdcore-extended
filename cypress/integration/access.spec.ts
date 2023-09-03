/// <reference types="cypress" />
import {openApp} from "../lib/login";

describe('Access', () => {
  beforeEach(openApp)
  it('should register', testRegistration)
  it('should login', testLogin)
})

function testLogin() {
  console.log('TODO Login')
}

function testRegistration() {
  console.log('TODO Registration')
}